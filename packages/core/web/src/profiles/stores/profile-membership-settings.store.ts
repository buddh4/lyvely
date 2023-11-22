import { defineStore } from 'pinia';
import { useStatus } from '@/core';
import { I18nModelValidator } from '@/i18n';
import { ref } from 'vue';
import { UpdateProfileMembershipSettings, useProfileMembershipClient } from '@lyvely/interface';
import { useProfileStore } from '@/profiles/stores/profile.store';

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
      await useProfileMembershipClient().update(model.value);
      membership!.userInfo.description = model.value.description;
      membership!.userInfo.displayName =
        model.value.displayName || membership!.userInfo.displayName;
    }

    return {
      status,
      model,
      validator,
      update,
    };
  },
);
