import { defineStore } from 'pinia';
import { loadingStatus, useStatus } from '@/core';
import { I18nModelValidator } from '@/i18n';
import { ref } from 'vue';
import {
  UpdateProfileMembershipSettings,
  useProfileMembershipClient,
  verifyProfileVisibilityLevel,
} from '@lyvely/interface';
import { useProfileStore } from '@/profiles/stores/profile.store';
import { useFlashStore } from '@/ui';
import { useAuthStore } from '@/auth';
import { useRouter } from 'vue-router';
import { useProfileRelationInfosStore } from './profile-relation-infos.store';

export const useUpdateProfileMembershipSettingsStore = defineStore(
  'update-profile-membership-settings',
  () => {
    const status = useStatus();
    const profileStore = useProfileStore();
    const membership = profileStore.profile!.getMembership();
    const client = useProfileMembershipClient();
    const router = useRouter();
    const model = ref(
      new UpdateProfileMembershipSettings({
        displayName: membership?.userInfo.displayName || '',
        description: membership?.userInfo.description || '',
      })
    );

    const validator = new I18nModelValidator(model.value);

    async function update() {
      await loadingStatus(() => client.update(model.value), status, validator);

      const userInfo = await profileStore.getUserInfo(useAuthStore().user!.id);
      if (userInfo && membership) {
        userInfo.description = membership.userInfo.description = model.value.description;
        userInfo.displayName = membership.userInfo.displayName =
          model.value.displayName || membership!.userInfo.displayName;
      }

      useFlashStore().addSavedFlash();
    }

    async function revoke() {
      try {
        const { id: pid } = profileStore.profile!;
        const { userRelations, role } = await client.revoke();
        profileStore.setUserRelations(userRelations, role);

        if (!verifyProfileVisibilityLevel(role, profileStore.profile!.visibility)) {
          profileStore.reset();
          await router.push({ path: '/' });
        } else {
          await router.push(profileStore.getRoute());
        }

        useProfileRelationInfosStore().removeRelation(pid);
        useFlashStore().addSuccessFlash();
      } catch (e) {
        useFlashStore().addUnknownErrorFlash();
      }
    }

    return {
      status,
      model,
      validator,
      update,
      revoke,
    };
  }
);
