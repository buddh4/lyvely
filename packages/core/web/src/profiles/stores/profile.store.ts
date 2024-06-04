import { defineStore } from 'pinia';
import { loadingStatus, localStorageManager, Status, useStatus } from '@/core';
import {
  DocumentNotFoundException,
  isMultiUserProfile as _isMultiUserProfile,
  ProfileRelationDetailsModel,
  ProfileRelationRole,
  ProfileRelationUserInfoModel,
  ProfileWithRelationsModel,
  TagModel,
  useProfileRelationInfosClient,
  useProfilesClient,
  verifyProfileRoleLevel,
} from '@lyvely/interface';
import { computed, ref, watch } from 'vue';
import { usePageStore } from '@/ui';
import { findByPath } from '@lyvely/common';
import { useLiveStore } from '@/live';
import { profileRoute } from '@/profiles/routes/profile-route.helper';
import { LocationQueryRaw } from 'vue-router';
import { useAuthStore } from '../../auth';

const LATEST_PROFILE_HANDLE = 'latest_profile_handle';
const LATEST_PROFILE_FEATURES = 'latest_profile_features';
export const latestProfileHandle = localStorageManager.getStoredValue(LATEST_PROFILE_HANDLE);

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<ProfileWithRelationsModel>();
  const locale = computed(() => profile.value?.locale);
  const status = useStatus();
  const profileClient = useProfilesClient();

  /** If set to true, the next profile path will fall back to the default profile. **/
  const resetFlag = ref(false);

  function reset() {
    resetFlag.value = true;
  }

  async function loadProfileById(pid: string): Promise<ProfileWithRelationsModel> {
    status.setStatus(Status.LOADING);
    if (!resetFlag.value && isCurrentProfileId(pid)) return Promise.resolve(profile.value!);

    const result = await loadingStatus(profileClient.getProfileById(pid), status);

    if (!result) throw new DocumentNotFoundException();

    await setActiveProfile(result);
    status.setStatus(Status.SUCCESS);

    return profile.value!;
  }

  async function loadProfile(handle?: string | false): Promise<ProfileWithRelationsModel> {
    status.setStatus(Status.LOADING);

    if (handle !== false && !resetFlag.value) {
      handle ??= latestProfileHandle.getValue() || undefined;
    } else {
      handle = undefined;
    }

    if (isCurrentProfileHandle(handle)) return Promise.resolve(profile.value!);

    try {
      const loadedProfile = await loadingStatus(
        handle ? profileClient.getProfileByHandle(handle) : profileClient.getDefaultProfile(),
        status
      );
      await setActiveProfile(loadedProfile);
      status.setStatus(Status.SUCCESS);
      resetFlag.value = false;
    } catch (err: any) {
      // Probably an error with latestProfileHandle e.g. profile got deleted
      if (handle && handle === latestProfileHandle.getValue()) return loadProfile(false);
      else throw err;
    }

    if (!profile.value) throw new DocumentNotFoundException();

    return profile.value;
  }

  function isCurrentProfileHandle(handle?: string) {
    return handle && profile.value?.handle === handle;
  }

  function isCurrentProfileId(id?: string) {
    return id && profile.value?.id === id;
  }

  function setActiveFeature(featureId: string) {
    if (!this.profile.value) return;
    const storageValue = localStorageManager.getStoredValue(
      LATEST_PROFILE_FEATURES + this.profile.value.id
    );
    const value = storageValue.getJson<string[]>([]).filter((feat) => feat !== featureId);
    value.push(featureId);
    storageValue.setJson(value.splice(0, 5));
  }

  function getLatestFeatures(): string[] {
    if (!this.profile.value) return [];
    const storageValue = localStorageManager.getStoredValue(
      LATEST_PROFILE_FEATURES + this.profile.value.id
    );
    return storageValue.getJson<string[]>([]);
  }

  async function setActiveProfile(activeProfile: ProfileWithRelationsModel) {
    profile.value = activeProfile;
    latestProfileHandle.setValue(activeProfile.handle);
    if (!profile.value.getMembership()) {
      useLiveStore().connectProfileGuest(profile.value.id);
    } else {
      useLiveStore().closeGuestConnection();
    }
    status.setStatus(Status.SUCCESS);
  }

  function onSwitchProfile(
    handler: (profile: ProfileWithRelationsModel, oldProfile?: ProfileWithRelationsModel) => void
  ) {
    watch(profile, (newProfile, oldProfile) => {
      if (newProfile && newProfile?.id !== oldProfile?.id) handler(newProfile, oldProfile);
    });
  }

  function updateScore(value: number) {
    if (profile.value) {
      profile.value.score = value;
    }
  }

  function updateTags(tags: TagModel[]) {
    if (!profile.value) {
      console.warn('Called updateTags for non existing profile');
      return;
    }

    tags.forEach((tag) => {
      const index = profile.value!.tags.findIndex((profileTag) => profileTag.id === tag.id);
      if (index !== undefined && index >= 0) {
        profile.value!.tags[index] = tag;
      } else {
        profile.value!.tags.push(tag);
      }
    });
  }

  function getTags(): Array<TagModel> {
    return profile?.value?.tags || [];
  }

  function getTagsByName(name: string): TagModel | undefined {
    return profile?.value?.tags?.find((tag) => tag.name === name);
  }

  function tagIdsToNames(ids?: string[]) {
    if (!ids?.length) return [];

    return getTags()
      .filter((tag) => ids.includes(tag.id))
      .map((tag) => tag.name);
  }

  function isMember() {
    if (!profile.value) return false;
    return !!profile.value.getMembership();
  }

  function isOwner() {
    return verifyRoleLevel(ProfileRelationRole.Owner);
  }

  function verifyRoleLevel(role: ProfileRelationRole) {
    if (!profile.value) return false;
    return verifyProfileRoleLevel(profile.value.role, role);
  }

  function getUserRole() {
    const { user } = useAuthStore();
    return profile.value?.role || user ? ProfileRelationRole.User : ProfileRelationRole.Visitor;
  }

  function getMemberUserInfo(uid: string): ProfileRelationUserInfoModel | undefined {
    const relation = profile.value?.profileRelations.find((realtion) => realtion.uid === uid);
    return relation?.userInfo;
  }

  async function getUserInfo(uid: string): Promise<ProfileRelationUserInfoModel | null> {
    try {
      const userInfo = getMemberUserInfo(uid);
      return userInfo
        ? userInfo
        : await useProfileRelationInfosClient().getProfileRelationUserInfo(profile.value!.id, uid);
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  function setUserRelations(relations: ProfileRelationDetailsModel[], role: ProfileRelationRole) {
    if (!profile.value) return;
    profile.value.userRelations = relations;
    profile.value.role = role;
  }

  function setPageTitle(title: Array<string> | string) {
    title = Array.isArray(title) ? title : [title];

    if (profile.value) {
      title.push(profile.value.name);
    }

    usePageStore().setTitle(title);
  }

  function getSetting<TResult = any>(key: string, defaultValue: TResult): TResult;
  function getSetting<TResult = any>(key: string, defaultValue?: undefined): TResult | undefined;
  function getSetting<TResult = any>(key: string, defaultValue?: TResult): TResult | undefined {
    return findByPath(profile.value?.settings, key, { defaultValue });
  }

  /**
   * Builds a route to the given route name and handle.
   * If no route name is provided the resulting route navigates to the home of the profile.
   * If no handle is provided this function uses the currently active profile.
   * If no profile is active, a route to the default profile is returned.
   * @param name
   * @param handle
   * @param query
   */
  function getRoute(name?: string | null, handle?: string, query?: LocationQueryRaw) {
    return profileRoute(name || getProfileHome(), handle || profile.value?.handle, query);
  }

  /**
   * Returns the route name of the initial profile route.
   * This may be configurable in the future.
   */
  function getProfileHome() {
    return 'stream';
  }

  function isMultiUserProfile() {
    return profile.value && _isMultiUserProfile(profile.value);
  }

  return {
    profile,
    locale,
    loadProfile,
    getSetting,
    loadProfileById,
    updateScore,
    getTags,
    getTagsByName,
    updateTags,
    tagIdsToNames,
    getUserInfo,
    setPageTitle,
    getMemberUserInfo,
    getRoute,
    isMultiUserProfile,
    onSwitchProfile,
    getUserRole,
    setActiveFeature,
    getLatestFeatures,
    setUserRelations,
    isMember,
    isOwner,
    verifyRoleLevel,
    reset,
    ...status,
  };
});
