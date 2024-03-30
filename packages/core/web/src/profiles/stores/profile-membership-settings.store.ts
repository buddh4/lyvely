import { defineStore } from 'pinia';
import { loadingStatus, useStatus } from '@/core';
import { I18nModelValidator } from '@/i18n';
import { ref } from 'vue';
import { UpdateProfileMembershipSettings, useProfileMembershipClient } from '@lyvely/interface';
import { useProfileStore } from '@/profiles/stores/profile.store';
import { useFlashStore } from '@/ui';
import { useAuthStore } from '@/auth';

export const useUpdateProfileMembershipSettingsStore = defineStore(
  'update-profile-membership-settings',
  () => {
    const status = useStatus();
    const profileStore = useProfileStore();
    const membership = profileStore.profile!.getMembership();
    const model = ref(
      new UpdateProfileMembershipSettings({
        displayName: membership?.userInfo.displayName || '',
        description: membership?.userInfo.description || '',
      }),
    );

    const validator = new I18nModelValidator(model.value);

    async function update() {
      await loadingStatus(
        () => useProfileMembershipClient().update(model.value),
        status,
        validator,
      );

      const userInfo = await profileStore.getUserInfo(useAuthStore().user!.id);
      if (userInfo && membership) {
        userInfo.description = membership.userInfo.description = model.value.description;
        userInfo.displayName = membership.userInfo.displayName =
          model.value.displayName || membership!.userInfo.displayName;
      }

      useFlashStore().addSavedFlash();
    }

    return {
      status,
      model,
      validator,
      update,
    };
  },
);
