<script setup lang="ts">
import { ChartModel, ChartType } from '@lyvely/analytics-interface';
import { ContentDropdown } from '@lyvely/web';
import GraphChart from './GraphChart.vue';

const props = defineProps<{ model: ChartModel }>();

const ChartComponent = {
  [ChartType.Graph]: GraphChart,
  [ChartType.Calendar]: GraphChart,
  [ChartType.Pie]: GraphChart,
}[props.model.config.type] as any;
</script>

<template>
  <div class="rounded border border-divide bg-main p-5 drop-shadow-md">
    <div class="text-sm font-bold flex justify-center relative">
      {{ model.getTitle() }}
      <div class="absolute right-0 top-0">
        <content-dropdown :content="model" />
      </div>
    </div>
    <Component :is="ChartComponent" :model="model" />
  </div>
</template>

<style scoped></style>
