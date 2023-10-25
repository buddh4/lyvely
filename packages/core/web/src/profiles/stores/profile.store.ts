import { defineStore } from 'pinia';
import { repository, Status, useStatus, localStorageManager, loadingStatus } from '@/core';
import { ProfileWithRelationsModel, TagModel } from '@lyvely/core-interface';

import { computed, ref } from 'vue';
import { useProfileService } from '@/profiles/services/profiles.service';
import { usePageStore } from '@/ui';
import { EntityNotFoundException } from '@lyvely/common';
import { useLiveStore } from '@/live';
import { useProfileRelationInfosService } from '../services';

const LATEST_PROFILE_ID = 'latest_profile_id';
const DEFAULT_PROFILE_ID = 'default';
export const latestProfileId = localStorageManager.getStoredValue(LATEST_PROFILE_ID);

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<ProfileWithRelationsModel>();
  const locale = computed(() => profile.value?.locale);
  const status = useStatus();
  const profileService = useProfileService();

  async function loadProfile(pid?: string): Promise<ProfileWithRelationsModel> {
    status.setStatus(Status.LOADING);

    const searchPid = pid || latestProfileId.getValue() || DEFAULT_PROFILE_ID;

    if (profile.value?.id === searchPid) return Promise.resolve(profile.value);

    try {
      const profile = await loadingStatus(profileService.getProfile(searchPid), status);
      await setActiveProfile(profile);
      status.setStatus(Status.SUCCESS);
    } catch (err: any) {
      // Probably an error with latestProfileId
      if (!pid && searchPid !== DEFAULT_PROFILE_ID) return loadProfile(DEFAULT_PROFILE_ID);
      else throw err;
    }

    if (!profile.value) throw new EntityNotFoundException();

    return profile.value;
  }

  async function setActiveProfile(activeProfile: ProfileWithRelationsModel) {
    profile.value = activeProfile;
    latestProfileId.setValue(activeProfile.id);
    if (!profile.value.getMembership()) {
      useLiveStore().connectProfileGuest(profile.value.id);
    } else {
      useLiveStore().closeGuestConnection();
    }
    status.setStatus(Status.SUCCESS);
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

  function getMemberUserInfo(uid: string) {
    const relation = profile.value?.profileRelations.find((realtion) => realtion.uid === uid);
    return relation?.userInfo;
  }

  async function getUserInfo(uid: string) {
    const userInfo = getMemberUserInfo(uid);
    return userInfo
      ? userInfo
      : useProfileRelationInfosService().getProfileRelationUserInfo(profile.value!.id, uid);
  }

  function setPageTitle(title: Array<string> | string) {
    title = Array.isArray(title) ? title : [title];

    if (profile.value) {
      title.push(profile.value.name);
    }

    usePageStore().setTitle(title);
  }

  return {
    profile,
    locale,
    loadProfile,
    updateScore,
    getTags,
    getTagsByName,
    updateTags,
    tagIdsToNames,
    getUserInfo,
    setPageTitle,
    getMemberUserInfo,
    ...status,
  };
});

const userProfileRepositoryPlugin = () => {
  repository.interceptors.request.use(function (config) {
    const profileStore = useProfileStore();
    if (!config.skipProfileIdParam && profileStore.profile) {
      const { profile } = profileStore;
      if (config.params) {
        config.params.pid = profileStore.profile.id;
      } else {
        config.params = { pid: profileStore.profile.id };
      }

      // We add the oid for organization sub profiles for server side optimization
      if (profile.hasOrg) {
        config.params.oid = profileStore.profile.oid;
      }
    }
    return config;
  });
};

userProfileRepositoryPlugin();
