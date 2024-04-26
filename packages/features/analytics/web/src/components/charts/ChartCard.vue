<script setup lang="ts">
import { ChartModel } from '@lyvely/analytics-interface';
import { ContentDropdown } from '@lyvely/web';
import { LyAlert, resolveComponentRegistration } from '@lyvely/ui';
import { getChartCategoryDefinition } from '@/registries';

const props = defineProps<{ model: ChartModel }>();

const category = getChartCategoryDefinition(props.model.config.category);

const ChartComponent = category?.component
  ? resolveComponentRegistration(category.component)
  : null;
</script>

<template>
  <div class="rounded border border-divide bg-main p-5 drop-shadow-md">
    <div class="text-sm font-bold flex justify-center relative">
      {{ model.getTitle() }}
      <div class="absolute right-0 top-0">
        <content-dropdown :content="model" />
      </div>
    </div>
    <Component :is="ChartComponent" v-if="ChartComponent" :model="model" />
    <ly-alert v-else type="danger" text="analytics.errors.invalid_category" />
  </div>
</template>

<style scoped></style>
