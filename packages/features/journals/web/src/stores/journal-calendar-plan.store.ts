import { defineStore } from 'pinia';
import { JournalFilter, JournalModel, JournalDataPointStore } from '@lyvely/journals-interface';
import { useJournalsService } from '@/journals/services/journals.service';
import { useTimeSeriesCalendarPlan } from '@/time-series';

export const useJournalPlanStore = defineStore('journal-calendar-plan', () => {
  return useTimeSeriesCalendarPlan<JournalModel, JournalFilter>({
    filter: new JournalFilter(),
    cache: new JournalDataPointStore(),
    contentTypes: [JournalModel.contentType],
    service: useJournalsService(),
  });
});