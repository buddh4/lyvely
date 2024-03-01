<script lang="ts" setup>
import { LyContentRoot, LyFloatingAddButton, LyLoader } from '@lyvely/ui';
import { useContentCreateStore } from '@lyvely/web';
import { ChartModel } from '@lyvely/analytics-interface';
import { useChartsStore } from '@/store/charts.store';
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import ChartCard from '@/components/charts/ChartCard.vue';

const chartsStore = useChartsStore();
const status = chartsStore.status;
const { charts } = storeToRefs(chartsStore);

const createEntry = () =>
  useContentCreateStore()
    .createContentType(ChartModel.contentType)
    .then(() => chartsStore.loadCharts());

onMounted(async () => {
  await chartsStore.loadCharts();
});
</script>

<template>
  <ly-content-root>
    <div v-if="status.isStatusSuccess()" class="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4">
      <chart-card v-for="chart in charts" :key="chart.id" :model="chart"></chart-card>
      <div
        class="rounded border border-divide p-5 drop-shadow-md cursor-pointer"
        @click="createEntry">
        <div
          class="flex justify-center items-center w-full h-full text-9xl text-secondary dark:text-secondary-dark">
          +
        </div>
      </div>
    </div>
    <div v-else-if="status.isStatusLoading()">
      <ly-loader />
    </div>
    <ly-floating-add-button @click="createEntry" />
  </ly-content-root>
</template>

<style scoped></style>
