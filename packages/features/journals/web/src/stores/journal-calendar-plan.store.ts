import { defineStore } from 'pinia';
import {
  JournalFilter,
  JournalModel,
  JournalDataPointStore,
  useJournalsClient,
} from '@lyvely/journals-interface';
import { useTimeSeriesCalendarPlan } from '@lyvely/time-series-web';

export const useJournalPlanStore = defineStore('journal-calendar-plan', () => {
  return useTimeSeriesCalendarPlan<JournalModel, JournalFilter>({
    filter: new JournalFilter(),
    cache: new JournalDataPointStore(),
    contentTypes: [JournalModel.contentType],
    client: useJournalsClient(),
  });
});
