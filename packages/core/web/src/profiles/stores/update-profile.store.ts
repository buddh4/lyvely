import { defineStore } from 'pinia';
import {
  CreateProfileModel,
  ProfileWithRelationsModel,
  UpdateProfileModel,
  useProfilesClient,
} from '@lyvely/interface';
import { useUpdateModelStore } from '@/common';
import { useProfileStore } from './profile.store';
import { useFlashStore } from '@/ui';

export const useUpdateProfileStore = defineStore('update-profile', () => {
  const editStore = useUpdateModelStore<
    ProfileWithRelationsModel,
    CreateProfileModel,
    UpdateProfileModel
  >({
    resetOnSuccess: false,
    client: useProfilesClient(),
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
