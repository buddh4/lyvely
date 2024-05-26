import { defineStore } from 'pinia';
import {
  JournalFilter,
  JournalModel,
  JournalDataPointStore,
  useJournalsClient,
} from '@lyvely/journals-interface';
import { useTimeSeriesCalendarPlan } from '@lyvely/time-series-web';
// TODO: https://github.com/microsoft/TypeScript/issues/47663
import type {} from 'mitt';
import type {} from '@lyvely/dates';

export const useJournalPlanStore = defineStore('journal-calendar-plan', () => {
  return useTimeSeriesCalendarPlan<JournalModel, JournalFilter>({
    filter: new JournalFilter(),
    cache: new JournalDataPointStore(),
    contentTypes: [JournalModel.contentType],
    client: useJournalsClient(),
  });
});
