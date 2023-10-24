import { defineStore } from 'pinia';
import {
  CreateProfileModel,
  ProfileWithRelationsModel,
  UpdateProfileModel,
} from '@lyvely/core-interface';
import { useUpdateModelStore } from '@/common';
import { useProfileStore } from './profile.store';
import { useProfileService } from '../services';
import { useFlashStore } from '@/ui';

export const useUpdateProfileStore = defineStore('update-profile', () => {
  const editStore = useUpdateModelStore<
    ProfileWithRelationsModel,
    CreateProfileModel,
    UpdateProfileModel
  >({
    resetOnSuccess: false,
    service: useProfileService(),
    onSubmitSuccess: (profile?: ProfileWithRelationsModel) => {
      if (profile) {
        useProfileStore().profile = profile;
      }
      useFlashStore().addSavedFlash();
    },
  });

  return {
    ...editStore,
  };
});
