import { defineStore, storeToRefs } from 'pinia';
import { useAuthStore } from '@/auth';
import { useCalendarPreferences } from '@/common';
import { useI18nStore } from '@/i18n';
import { useUserAccountClient } from '@lyvely/interface';

export const useAccountCalendarPreferencesStore = defineStore(
  'account-calendar-preferences',
  () => {
    const { locale } = storeToRefs(useI18nStore());
    return useCalendarPreferences({
      locale,
      client: useUserAccountClient(),
      getPreferences: () => useAuthStore().getSetting('calendar'),
      setSettings: (settings: any) => {
        useAuthStore().user!.settings = settings;
      },
    });
  }
);
