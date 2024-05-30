import { defineStore, storeToRefs } from 'pinia';
import { useCalendarPreferences } from '@/common';
import { useProfileStore } from './profile.store';
import { useProfilesClient } from '@lyvely/interface';

export const useProfileCalendarPreferencesStore = defineStore(
  'profile-calendar-preferences',
  () => {
    const profileStore = useProfileStore();
    const { locale } = storeToRefs(profileStore);
    return useCalendarPreferences({
      locale,
      client: useProfilesClient(),
      getPreferences: () => profileStore.getSetting('calendar'),
      setSettings: (settings: any) => {
        profileStore.profile!.settings = settings;
      },
    });
  }
);
