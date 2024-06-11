<script lang="ts" setup>
import { findFirst, LyContentRoot, LyFloatingAddButton, LyLoader } from '@lyvely/ui';
import {
  IDragEvent,
  SortResult,
  useContentCreateStore,
  useGlobalDialogStore,
  useProfilePermissions,
  t,
} from '@lyvely/web';
import { ChartModel, useChartsClient, useChartPermissions } from '@lyvely/analytics-interface';
import { useChartsStore } from '@/store/charts.store';
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import ChartCard from '@/components/charts/ChartCard.vue';
import Draggable from 'vuedraggable';

const chartsStore = useChartsStore();
const status = chartsStore.status;
const { charts } = storeToRefs(chartsStore);

const { isAllowed: canCreateCharts } = useProfilePermissions(useChartPermissions().Create);

const createEntry = () =>
  useContentCreateStore()
    .createContentType(ChartModel.contentType)
    .then(() => chartsStore.loadCharts());

function findChart(cid: string) {
  return charts.value.find((chart) => chart.id === cid);
}

async function sort(evt: IDragEvent) {
  const cid = findFirst(evt.item, '[data-cid]')?.dataset.cid;

  if (!cid) {
    console.error('Could not move entry, no cid found for event.');
    return;
  }

  const model = findChart(cid);

  if (!model) {
    console.error('Could not move entry, invalid cid used.');
    return;
  }

  const attachTo = evt.newIndex > 0 ? charts.value[evt.newIndex - evt.newIndex] : undefined;

  const oldSortOrder = model.meta.sortOrder;
  // We manually set the sortOrder to prevent flickering
  model.meta.sortOrder = attachTo ? (attachTo.meta.sortOrder || 0) + 0.1 : 0;

  try {
    const sortResult = await useChartsClient().sort(model.id, { attachToId: attachTo?.id });
    sortResult.sort.forEach((update: SortResult) => {
      const entry = findChart(update.id);
      if (!entry) return;
      entry.meta.sortOrder = update.sortOrder;
    });
  } catch (e) {
    model.meta.sortOrder = oldSortOrder;
    useGlobalDialogStore().showUnknownError();
  }
}

onMounted(async () => {
  await chartsStore.loadCharts();
});
</script>

<template>
  <ly-content-root>
    <div v-if="status.isStatusSuccess()" class="">
      <draggable
        :list="charts"
        tag="div"
        drag-class="bg-main"
        class="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3 md:gap-4"
        group="charts"
        handle=".icon-drag"
        item-key="id"
        @end="sort">
        <template #item="{ element }">
          <div :data-cid="element.id">
            <chart-card :key="element.id" :model="element" />
          </div>
        </template>
        <template #footer>
          <div
            v-if="!charts.length || canCreateCharts"
            class="cursor-pointer rounded border border-divide p-5 drop-shadow-md"
            @click="createEntry">
            <div
              v-if="canCreateCharts"
              class="flex h-full w-full select-none items-center justify-center text-9xl text-secondary dark:text-secondary-dark">
              +
            </div>
            <div v-else class="flex h-full flex-col items-center justify-center">
              <ly-icon name="statistics" class="w-20 text-gray-300 dark:text-gray-500" />
              <span class="font-semibold">{{ t('analytics.messages.empty') }}</span>
            </div>
          </div>
        </template>
      </draggable>
    </div>
    <div v-else-if="status.isStatusLoading()">
      <ly-loader />
    </div>
    <ly-floating-add-button @click="createEntry" />
  </ly-content-root>
</template>

<style scoped></style>
