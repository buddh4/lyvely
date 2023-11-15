import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getFallbackLocale } from '@/i18n';
import { useAuthStore } from '@/auth';
import { useAccountService } from '../services';
import { SetLanguageDto } from '@lyvely/core-interface';
import { validate } from 'class-validator';
import { useGlobalDialogStore } from '@/core';

export const useSetAccountLanguageStore = defineStore('set-account-language', () => {
  const authStore = useAuthStore();
  const accountService = useAccountService();
  const showSetLanguageModal = ref(false);

  const updateLocale = ref(authStore.user!.locale?.toLowerCase() || getFallbackLocale());

  function resetUpdateLocale() {
    updateLocale.value = authStore.user!.locale?.toLowerCase() || getFallbackLocale();
  }

  async function setLanguage() {
    if (authStore.user!.locale === updateLocale.value) {
      showSetLanguageModal.value = false;
      return;
    }

    const dto = new SetLanguageDto({ locale: updateLocale.value });
    const errors = await validate(dto);

    if (errors.length) {
      showError();
      return;
    }

    try {
      await accountService.setLanguage(dto);
      // Currently we need to reload, since we do not know of all locale files to load.
      location.reload();
    } catch (e) {
      showError();
    }
  }

  function showError() {
    showSetLanguageModal.value = false;
    useGlobalDialogStore().showUnknownError();
  }

  return {
    updateLocale,
    resetUpdateLocale,
    showSetLanguageModal,
    setLanguage,
  };
});
