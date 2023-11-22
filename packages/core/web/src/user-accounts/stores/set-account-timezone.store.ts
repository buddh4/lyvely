import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useI18nStore } from '@/i18n';
import { useAuthStore } from '@/auth';
import { useAccountService } from '../services';
import { SetTimezoneDto } from '@lyvely/interface';
import { validate } from 'class-validator';
import { useGlobalDialogStore } from '@/core';
import { getTimezone } from '@lyvely/dates';

export const useSetAccountTimezoneStore = defineStore('set-account-timezone', () => {
  const authStore = useAuthStore();
  const accountService = useAccountService();
  const showSetTimezoneModal = ref(false);

  const updateTimezone = ref(authStore.user!.timezone);

  function resetUpdateTimezone() {
    updateTimezone.value = authStore.user!.timezone || getTimezone();
  }

  async function setTimezone() {
    if (authStore.user!.timezone === updateTimezone.value) {
      showSetTimezoneModal.value = false;
      return;
    }

    const dto = new SetTimezoneDto({ timezone: updateTimezone.value });
    const errors = await validate(dto);

    if (errors.length) {
      showError();
      return;
    }

    try {
      await accountService.setTimezone(dto);
      authStore.user!.timezone = dto.timezone;
      useI18nStore().setTimezone(dto.timezone);
      showSetTimezoneModal.value = false;
    } catch (e) {
      showError();
    }
  }

  function showError() {
    showSetTimezoneModal.value = false;
    useGlobalDialogStore().showUnknownError();
  }

  return {
    updateTimezone,
    resetUpdateTimezone,
    showSetTimezoneModal,
    setTimezone,
  };
});
