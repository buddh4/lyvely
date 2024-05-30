import { defineStore, storeToRefs } from 'pinia';
import {
  CreateProfileModel,
  ProfileRelationInfo,
  ProfileWithRelationsModel,
  UpdateProfileModel,
  useProfilesClient,
} from '@lyvely/interface';
import { useUpdateModelStore } from '@/common';
import { useProfileStore } from './profile.store';
import { useFlashStore } from '@/ui';
import { useProfileRelationInfosStore } from './profile-relation-infos.store';

export const useUpdateProfileStore = defineStore('update-profile', () => {
  const client = useProfilesClient();
  const profileStore = useProfileStore();
  const { profile } = storeToRefs(profileStore);

  const editStore = useUpdateModelStore<
    ProfileWithRelationsModel,
    CreateProfileModel,
    UpdateProfileModel
  >({
    resetOnSuccess: false,
    client,
    onSubmitSuccess: (profile?: ProfileWithRelationsModel) => {
      if (profile) {
        useProfileStore().profile = profile;
      }
      useFlashStore().addSavedFlash();
    },
  });

  const archive = async () => {
    try {
      if (!profile.value) return;
      await client.archive();
      profile.value!.archived = true;
      useProfileRelationInfosStore().updateRelation(
        profile.value.id,
        (relation: ProfileRelationInfo) => {
          relation.archived = true;
        }
      );
    } catch (e) {
      useFlashStore().addUnknownErrorFlash();
    }
  };

  const restore = async () => {
    try {
      if (!profile.value) return;
      await client.restore();
      profile.value!.archived = false;
      useProfileRelationInfosStore().updateRelation(
        profile.value.id,
        (relation: ProfileRelationInfo) => {
          relation.archived = false;
        }
      );
    } catch (e) {
      useFlashStore().addUnknownErrorFlash();
    }
  };

  return {
    archive,
    restore,
    ...editStore,
  };
});
