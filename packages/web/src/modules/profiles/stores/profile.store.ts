import { defineStore } from 'pinia';
import { Status, useStatus } from '@/store';
import { ProfileWithRelationsDto, TagModel } from '@lyvely/common';
import { localStorageManager } from '@/util/storage';
import { DialogExceptionHandler } from '@/modules/core/handler/exception.handler';

import { computed, ref } from 'vue';
import { useProfileService } from '@/modules/profiles/services/profiles.service';
import repository from '@/repository';

const DEFAULT_PROFILE_ID = 'latest_profile_id';
export const latestProfileId = localStorageManager.getStoredValue(DEFAULT_PROFILE_ID);

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<ProfileWithRelationsDto>();
  const locale = computed(() => profile.value?.locale);
  const tagOptions = computed(() => profile.value?.tags?.map((tag: TagModel) => tag.name) || []);
  const status = useStatus();
  const profileService = useProfileService();

  async function loadProfile(id?: string) {
    status.setStatus(Status.LOADING);

    id = id || latestProfileId.getValue() || 'default';

    if (profile.value?.id === id) return Promise.resolve(profile.value);

    try {
      await setActiveProfile(await profileService.getProfile(id));
      status.setStatus(Status.SUCCESS);
    } catch (err) {
      status.setStatus(Status.ERROR);
      DialogExceptionHandler('Profile could not be loaded...', this)(err);
    }

    return profile.value;
  }

  async function setActiveProfile(activeProfile: ProfileWithRelationsDto) {
    profile.value = activeProfile;
    latestProfileId.setValue(activeProfile.id);
    status.setStatus(Status.SUCCESS);
  }

  function updateScore(value: number) {
    if (profile.value) {
      profile.value.score = value;
    }
  }

  async function updateTags(tags: TagModel[]) {
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

  return {
    profile,
    locale,
    loadProfile,
    updateScore,
    tagOptions,
    getTags,
    updateTags,
    ...status,
  };
});

const userProfileRepositoryPlugin = () => {
  repository.interceptors.request.use(function (config) {
    const profileStore = useProfileStore();
    if (!config.skipProfileIdParam && profileStore.profile) {
      if (config.params) {
        config.params.pid = profileStore.profile.id;
      } else {
        config.params = { pid: profileStore.profile.id };
      }
    }
    return config;
  });
};

userProfileRepositoryPlugin();
