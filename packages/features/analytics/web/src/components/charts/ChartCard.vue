<script setup lang="ts">
import { ChartModel, ChartCategory } from '@lyvely/analytics-interface';
import { ContentDropdown } from '@lyvely/web';
import GraphChart from './GraphChart.vue';

const props = defineProps<{ model: ChartModel }>();

const ChartComponent = {
  [ChartCategory.Graph]: GraphChart,
  [ChartCategory.Pie]: GraphChart,
}[props.model.config.category];
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
