import { defineStore } from 'pinia';
import {
  JournalFilter,
  JournalModel,
  JournalDataPointStore,
  toTimingId,
  formatDate,
  DataPointModel,
} from '@lyvely/common';
import { useCalendarPlan, useCalendarPlanStore } from '@/modules/calendar-plan';
import { useJournalsService } from '@/modules/journals/services/journals.service';
import { useGlobalDialogStore } from '@/modules/core/store/global.dialog.store';
import { ref } from 'vue';

export const useJournalPlanStore = defineStore('journal-plan', () => {
  const calendarPlanStore = useCalendarPlanStore();
  const journalsService = useJournalsService();
  const dialog = useGlobalDialogStore();
  const showFilterDrawer = ref(false);
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
      const result = await journalsService.updateDataPoint(dataPoint.cid, {
        date: formatDate(calendarPlanStore.date),
        value: value,
      });

      cache.value.setDataPoint(result.dataPoint);
    } catch (e) {
      dataPoint.value = oldValue;
      dialog.showUnknownError();
    }
  }

  return {
    ...calendarPlan,
    getDataPoint,
    updateDataPoint,
    showFilterDrawer,
  };
});
