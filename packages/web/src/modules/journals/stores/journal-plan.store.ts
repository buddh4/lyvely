import { defineStore } from 'pinia';
import {
  JournalFilter,
  JournalModel,
  JournalDataPointStore,
  HabitModel,
  toTimingId,
  NumberDataPointModel,
  formatDate,
  DataPointModel,
} from '@lyvely/common';
import { useCalendarPlan, useCalendarPlanStore } from '@/modules/calendar-plan';
import { useJournalsService } from '@/modules/journals/services/journals.service';

export const useJournalPlanStore = defineStore('journal-plan', () => {
  const calendarPlanStore = useCalendarPlanStore();
  const journalsService = useJournalsService();
  const calendarPlan = useCalendarPlan<JournalModel, JournalFilter>({
    filter: new JournalFilter(),
    cache: new JournalDataPointStore(),
    service: journalsService,
  });

  const { cache } = calendarPlan;

  function getDataPoint(model: JournalModel) {
    const timingId = toTimingId(calendarPlanStore.date, model.timeSeriesConfig.interval);
    return cache.value.getDataPoint(model, timingId, true);
  }

  async function updateDataPoint(dataPoint: DataPointModel, value: number) {
    const oldValue = dataPoint.value;

    try {
      dataPoint.value = value;
      const result = await habitsService.updateDataPoint(dataPoint.cid, {
        date: formatDate(calendarPlanStore.date),
        value: value,
      });

      cache.value.setDataPoint(result.dataPoint);
      profileStore.updateScore(result.score);
    } catch (e) {
      dataPoint.value = oldValue;
      dialog.showUnknownError();
    }
  }

  return {
    ...calendarPlan,
    getDataPoint,
    updateDataPoint,
  };
});
