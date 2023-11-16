import { defineStore, storeToRefs } from 'pinia';
import { useAuthStore } from '@/auth';
import { useAccountService } from '../services';
import { ICalendarPreferences } from '@lyvely/dates';
import { useCalendarPreferences } from '@/common';
import { useI18nStore } from '@/i18n';

export const useAccountCalendarPreferencesStore = defineStore(
  'account-calendar-preferences',
  () => {
    const { locale } = storeToRefs(useI18nStore());
    return useCalendarPreferences({
      locale,
      service: useAccountService(),
      getPreferences: () => useAuthStore().getSetting('calendar'),
      setSettings: (settings: any) => {
        useAuthStore().user!.settings = settings;
      },
    });
  },
);
