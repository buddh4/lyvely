import { CalendarPreferences, SettingsUpdateResponse } from '@lyvely/interface';
import { getDefaultCalendarPreferences, ICalendarPreferences } from '@lyvely/dates';
import { ref, ComputedRef, Ref, watch } from 'vue';
import { validate } from 'class-validator';
import { loadingStatus, useGlobalDialogStore, useStatus } from '@/core';
import { getFallbackLocale } from '@/i18n';

export interface ICalendarPreferenceClient {
  setCalendarPreferences(dto: CalendarPreferences): Promise<SettingsUpdateResponse>;
}

interface ICalendarPreferencesOptions {
  client: ICalendarPreferenceClient;
  locale: Ref<string | undefined> | ComputedRef<string | undefined>;
  getPreferences(): ICalendarPreferences | undefined;
  setSettings(settings: any): void;
}
export const useCalendarPreferences = (options: ICalendarPreferencesOptions) => {
  const { locale, getPreferences, client, setSettings } = options;
  let defaults = getDefaultCalendarPreferences(locale.value || getFallbackLocale());

  watch(locale, () => {
    defaults = getDefaultCalendarPreferences(locale.value || getFallbackLocale());
  });

  const showWeekStartModal = ref(false);
  const showYearStartModal = ref(false);

  const weekStart = ref(getPreferences()?.weekStart ?? defaults.weekStart);
  const yearStart = ref(getPreferences()?.yearStart ?? defaults.yearStart);

  const status = useStatus();

  function reset() {
    weekStart.value = getPreferences()?.weekStart ?? defaults.weekStart;
    yearStart.value = getPreferences()?.yearStart ?? defaults.yearStart;
    showWeekStartModal.value = false;
    showYearStartModal.value = false;
  }

  async function setWeekStart() {
    return validateAndSendPreferences(new CalendarPreferences({ weekStart: weekStart.value }));
  }

  async function setYearStart() {
    return validateAndSendPreferences(new CalendarPreferences({ yearStart: yearStart.value }));
  }

  async function validateAndSendPreferences(dto: CalendarPreferences) {
    const errors = await validate(dto);

    if (errors.length) {
      showError();
      return;
    }

    try {
      const response = await loadingStatus(() => client.setCalendarPreferences(dto), status);
      setSettings(response.settings);
    } catch (e) {
      showError();
    } finally {
      reset();
    }
  }

  function showError() {
    showWeekStartModal.value = false;
    showYearStartModal.value = false;
    useGlobalDialogStore().showUnknownError();
  }

  return {
    weekStart,
    yearStart,
    reset,
    status,
    showWeekStartModal,
    showYearStartModal,
    setWeekStart,
    setYearStart,
  };
};
