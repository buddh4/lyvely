import { defineStore } from 'pinia';
import { Status, useStatus } from '@/store/status';
import { ProfileDto, ITag } from '@lyvely/common';

import profileRepository from '@/modules/user/repositories/profile.repository';
import { localStorageManager } from '@/util/storage';
import { DialogExceptionHandler } from '@/modules/core/handler/exception.handler';

import { ref, computed, ComputedRef } from 'vue';

const DEFAULT_PROFILE_KEY = 'default_profile';

export const latestProfileId = localStorageManager.getStoredValue(DEFAULT_PROFILE_KEY);

export const useProfileStore = defineStore('profile', () => {
  const profile = ref(undefined) as ComputedRef<ProfileDto|undefined>;
  const membership = ref(undefined);
  const profiles = ref(new Array<ProfileDto>());

  // TODO: (i18n) validate defaultLocale
  const defaultLocale = navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;
  const locale = computed(() => profile.value?.locale || defaultLocale);
  const tagOptions = computed(() => profile.value?.tags?.map((tag: ITag) => category.name) || []);

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

  async function setActiveProfile(profile: Profile) {
    profile.value = profile;
    latestProfileId.setValue(profile.id);
    this.setStatus(Status.SUCCESS);
  }

  function getProfile(profileSearch?: Profile|string) {
    const profileId = typeof profileSearch === 'string' ? profileSearch : profileSearch.id;
    return profiles.value.find(p => p.id === profileId);
  }

  function updateScore(value: number, profileToEdit?: Profile|string) {
    profileToEdit = profileToEdit ? getProfile(profileToEdit) : profile.value;

    if(profileToEdit) {
      profileToEdit.score = value;
    }
  }

  async function updateProfileCategories(profileToEdit?: Profile|string) {
    profileToEdit = profileToEdit ? getProfile(profileToEdit) : profile.value;

    try {
      if(profileToEdit) {
        const { data: { categories } } = await profileRepository.getCategories(profileToEdit.name);
        profileToEdit.categories = categories;
      }
    } catch(e) {
      // TODO: Implement
    }
  }

  return {
    profile,
    membership,
    profiles,
    loadProfile,
    updateScore,
    updateProfileCategories,
    ...useStatus() };
  }
})

