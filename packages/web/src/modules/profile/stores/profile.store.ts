import { defineStore } from 'pinia';
import { Status, useStatus } from '@/store/status';
import { ITag , ProfileMembershipDto } from '@lyvely/common';

import profileRepository from '@/modules/profile/repositories/profile.repository';
import { localStorageManager } from '@/util/storage';
import { DialogExceptionHandler } from '@/modules/core/handler/exception.handler';

import { ref, computed, Ref } from 'vue';

const DEFAULT_PROFILE_KEY = 'default_profile';

export const latestProfileId = localStorageManager.getStoredValue(DEFAULT_PROFILE_KEY);

export const useProfileStore = defineStore('profile', () => {
  const profile = ref(undefined) as Ref<ProfileMembershipDto|undefined>;
  const membership = ref(undefined);

  // TODO: (i18n) validate defaultLocale
  const defaultLocale = navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;
  const locale = computed(() => profile.value?.locale || defaultLocale);
  const tagOptions = computed(() => profile.value?.tags?.map((tag: ITag) => tag.name) || []);
  const status = useStatus();

  async function loadProfile(id?: string|null) {
    this.status = Status.LOADING;

    /**
     * TODO: If latestProfileId is an invalid one we need to redirect to default profile
     * otherwise
      */

    //
    id = id || latestProfileId.getValue();

    if(profile.value?.id === id) {
      return Promise.resolve(profile.value);
    }

    try {
      const { data } = await profileRepository.getProfile(id);
      await setActiveProfile(data);
    } catch (err) {
      const { data } = await profileRepository.getDefaultProfile();
      await setActiveProfile(data);
      DialogExceptionHandler('Profile could not be loaded...', this)(err);
    }

    return profile.value;
  }

  async function setActiveProfile(activeProfile: ProfileMembershipDto) {
    profile.value = activeProfile;
    latestProfileId.setValue(activeProfile.id);
    status.setStatus(Status.SUCCESS);
  }

  function updateScore(value: number) {
    if(profile.value) {
      profile.value.score = value;
    }
  }

  async function updateTags(tags: ITag[]) {
    if(!profile.value) {
      console.warn('Called updateTags for non existing profile');
      return;
    }

    tags.forEach(tag => {
      const index = profile.value!.tags.findIndex(profileTag  => profileTag.id === tag.id);
      if(index >= 0) {
        profile.value!.tags[index] = tag;
      } else {
        profile.value!.tags.push(tag);
      }
    });
  }

  function getTags(): Array<ITag> {
    return profile?.value?.tags || [];
  }

  return {
    profile,
    membership,
    loadProfile,
    updateScore,
    tagOptions,
    getTags,
    locale,
    updateTags,
    ...status
  };
})

