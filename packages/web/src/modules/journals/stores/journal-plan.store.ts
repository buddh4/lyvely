import { defineStore, storeToRefs } from 'pinia';
import {
  JournalFilter,
  JournalModel,
  JournalDataPointStore,
  toTimingId,
  formatDate,
  DataPointModel,
} from '@lyvely/common';
import { useCalendarPlanStore } from '@/modules/calendar-plan';
import { useJournalsService } from '@/modules/journals/services/journals.service';
import { useGlobalDialogStore } from '@/modules/core/store/global.dialog.store';
import { useContentStore } from '@/modules/content/stores/content.store';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { useTimeSeriesCalendarPlan } from '@/modules/time-series';

export const useJournalPlanStore = defineStore('journal-plan', () => {
  const calendarPlanStore = useCalendarPlanStore();
  const journalsService = useJournalsService();
  const dialog = useGlobalDialogStore();
  const contentStore = useContentStore();
  const { locale } = storeToRefs(useProfileStore());

  contentStore.onContentCreated(JournalModel.contentType, addJournal);
  contentStore.onContentUpdated(JournalModel.contentType, addJournal);

  const calendarPlan = useTimeSeriesCalendarPlan<JournalModel, JournalFilter>({
    filter: new JournalFilter(),
    cache: new JournalDataPointStore(),
    service: journalsService,
  });

  const { cache } = calendarPlan;

  // TODO: move this into timeSeriesCalendarPlan composable
  function getDataPoint(model: JournalModel) {
    const timingId = toTimingId(
      calendarPlanStore.date,
      model.timeSeriesConfig.interval,
      locale.value,
    );
    return cache.value.getDataPoint(model, timingId, true);
  }

  function addJournal(model: JournalModel) {
    cache.value.setModel(new JournalModel(model));
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
  };
});
