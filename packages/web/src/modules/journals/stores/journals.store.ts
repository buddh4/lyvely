import { defineStore } from 'pinia';
import { JournalFilter, JournalModel, JournalDataPointStore } from '@lyvely/common';
import { useCalendarPlan } from '@/modules/calendar/composables/calendar-plan-store.composable';
import { useJournalsService } from '@/modules/journals/services/journals.service';

export const useJournalStore = defineStore('journals', () => {
  const calendarPlan = useCalendarPlan<JournalModel, JournalFilter>({
    filter: new JournalFilter(),
    cache: new JournalDataPointStore(),
    service: useJournalsService(),
  });

  return {
    ...calendarPlan,
  };
});
