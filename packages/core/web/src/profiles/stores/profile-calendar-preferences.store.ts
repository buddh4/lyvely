import { defineStore, storeToRefs } from 'pinia';
import { useProfileService } from '../services';
import { ICalendarPreferences } from '@lyvely/dates';
import { useCalendarPreferences } from '@/common';
import { useProfileStore } from '@/profiles';

export const useProfileCalendarPreferencesStore = defineStore(
  'profile-calendar-preferences',
  () => {
    const profileStore = useProfileStore();
    const { locale } = storeToRefs(profileStore);
    return useCalendarPreferences({
      locale,
      service: useProfileService(),
      getPreferences: () => profileStore.getSetting('calendar'),
      setSettings: (settings: any) => {
        profileStore.profile!.settings = settings;
      },
    });
  },
);
