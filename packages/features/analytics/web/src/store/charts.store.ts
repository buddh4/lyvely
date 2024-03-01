import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ChartModel, useChartsClient } from '@lyvely/analytics-interface';
import {
  ContentFilter,
  loadingStatus,
  useContentStore,
  useProfileStore,
  useStatus,
} from '@lyvely/web';
import { findAndRemove, findAndReplace } from '@lyvely/common';

export const useChartsStore = defineStore('analytics.charts', () => {
  const charts = ref<ChartModel[]>([]);
  const client = useChartsClient();
  const status = useStatus();
  const contentStore = useContentStore();
  const filter = new ContentFilter();

  function reset() {
    charts.value = [];
    status.resetStatus();
  }

  const updateOrPushChart = (content: ChartModel) => {
    if (!filter.check(content)) return;
    findAndReplace(charts.value, content, 'id', true);
  };

  const removeChart = (content: ChartModel) => {
    findAndRemove(charts.value, content, 'id');
  };

  useProfileStore().onSwitchProfile(reset);
  contentStore.onContentCreated(ChartModel.contentType, updateOrPushChart);
  contentStore.onContentUpdated(ChartModel.contentType, updateOrPushChart);
  contentStore.onContentRestored(ChartModel.contentType, updateOrPushChart);
  contentStore.onContentArchived(ChartModel.contentType, removeChart);

  const loadCharts = async () => {
    const { charts: loadedCharts } = await loadingStatus(() => client.getCharts(), status);
    charts.value = loadedCharts;
  };

  return {
    status,
    charts,
    loadCharts,
    updateOrPushChart,
  };
});
