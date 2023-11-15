import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from '@/auth';
import { useAccountService } from '../services';
import { CalendarPreferences } from '@lyvely/core-interface';
import { validate } from 'class-validator';
import { useGlobalDialogStore } from '@/core';
import { getDefaultCalendarPreferences } from '@lyvely/dates';

export const useUpdateAccountCalendarPreferencesStore = defineStore(
  'update-account-calendar-preferences',
  () => {
    const { user } = storeToRefs(useAuthStore());
    const accountService = useAccountService();
    const defaultPreferences = getDefaultCalendarPreferences(user.value!.locale);
    const showWeekStartModal = ref(false);
    const showWeekStrategyModal = ref(false);

    const weekStart = ref(
      user.value!.settings?.calendar?.weekStart ?? defaultPreferences.weekStart,
    );

    const weekStrategy = ref('');

    function reset() {
      weekStart.value = user.value!.settings?.calendar?.weekStart ?? defaultPreferences.weekStart;
      weekStrategy.value = '';
    }

    async function setWeekStart() {
      const dto = new CalendarPreferences({ weekStart: weekStart.value });
      const errors = await validate(dto);

      if (errors.length) {
        showError();
        return;
      }

      try {
        const response = await accountService.setCalendarPreferences(dto);
        user.value!.settings = response.settings;
        showWeekStartModal.value = false;
        reset();
      } catch (e) {
        showError();
      }
    }

    function showError() {
      showWeekStartModal.value = false;
      showWeekStrategyModal.value = false;
      useGlobalDialogStore().showUnknownError();
    }

    return {
      weekStart,
      reset,
      showWeekStartModal,
      showWeekStrategyModal,
      setWeekStart,
    };
  },
);
