import { defineStore } from 'pinia';
import { Status, useStatus } from '@/store/status';
import { ProfileDto, ITag, IProfile } from '@lyvely/common';

import profileRepository from '@/modules/user/repositories/profile.repository';
import { localStorageManager } from '@/util/storage';
import { DialogExceptionHandler } from '@/modules/core/handler/exception.handler';

import { ref, computed, WritableComputedRef } from 'vue';

const DEFAULT_PROFILE_KEY = 'default_profile';

export const latestProfileId = localStorageManager.getStoredValue(DEFAULT_PROFILE_KEY);

export const useProfileStore = defineStore('profile', () => {
  const profile = ref(undefined) as WritableComputedRef<ProfileDto|undefined>;
  const membership = ref(undefined);
  const profiles = ref(new Array<ProfileDto>());

  // TODO: (i18n) validate defaultLocale
  const defaultLocale = navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;
  const locale = computed(() => profile.value?.locale || defaultLocale);
  const tagOptions = computed(() => profile.value?.tags?.map((tag: ITag) => tag.name) || []);
  const status = useStatus();

  async function loadProfile(id?: string|null) {
    this.status = Status.LOADING;
    id = id || latestProfileId.getValue();

    if(profile.value?.id === id) {
      return Promise.resolve(profile.value);
    }

    try {
      const { data: { profile: p } } = await profileRepository.getProfile(id);
      await setActiveProfile(p);
    } catch (err) {
      const { data: { profile: p } } = await profileRepository.getDefaultProfile();
      await setActiveProfile(p);
      DialogExceptionHandler('Profile could not be loaded...', this)(err);
    }

    return profile.value;
  }

  async function setActiveProfile(activeProfile: ProfileDto) {
    profile.value = activeProfile;
    latestProfileId.setValue(activeProfile.id);
    status.setStatus(Status.SUCCESS);
  }

  function getProfile(profileSearch: IProfile|string) {
    const profileId = typeof profileSearch === 'string' ? profileSearch : profileSearch.id;
    return profiles.value.find(p => p.id === profileId);
  }

  function updateScore(value: number, profileToEdit?: IProfile|string) {
    profileToEdit = profileToEdit ? getProfile(profileToEdit) : profile.value;

    if(profileToEdit) {
      profileToEdit.score = value;
    }
  }

  async function updateProfileCategories(profileToEdit?: IProfile|string) {
    profileToEdit = profileToEdit ? getProfile(profileToEdit) : profile.value;

    try {
      if(profileToEdit) {
        const { data: { categories } } = await profileRepository.getTags(profileToEdit.name);
        profileToEdit.tags = categories;
      }
    } catch(e) {
      // TODO: Implement
    }
  }

  function getTags(feature?: string) {
    //TODO: feature filter and other filters
    return profile?.value?.tags || [];
  }

  return {
    profile,
    membership,
    profiles,
    loadProfile,
    updateScore,
    tagOptions,
    getTags,
    updateProfileCategories,
    ...status
  };
})

