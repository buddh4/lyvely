<script setup lang="ts">
import { ChartModel } from '@lyvely/analytics-interface';
import { ContentToolbar, ContentDropdown, toContentDetails } from '@lyvely/web';
import { LyAlert, LyIcon, resolveComponentRegistration } from '@lyvely/ui';
import { getChartCategoryDefinition } from '@/registries';

const props = defineProps<{ model: ChartModel }>();

const category = getChartCategoryDefinition(props.model.config.category);

const ChartComponent = category?.component
  ? resolveComponentRegistration(category.component)
  : null;
</script>

<template>
  <div class="chart-card rounded border border-divide bg-main p-5 drop-shadow-md">
    <div class="relative flex h-5 justify-center text-sm font-bold">
      <div class="mr-auto w-5">
        <button
          v-if="model.policies.canWrite"
          type="button"
          class="my-auto mr-2 w-5 cursor-move text-secondary">
          <ly-icon name="drag" class="show-on-hover w-5 md:hidden" />
        </button>
      </div>
      <router-link :to="toContentDetails(model)" class="text-main">
        {{ model.getTitle() }}
      </router-link>
      <div class="ml-auto w-5">
        <content-dropdown :content="model" class="show-on-hover md:hidden" />
      </div>
    </div>
    <Component :is="ChartComponent" v-if="ChartComponent" :model="model" />
    <ly-alert v-else type="danger" text="analytics.errors.invalid_category" />
    <content-toolbar :model="model" />
  </div>
</template>

<style scoped>
.chart-card:hover .show-on-hover {
  display: inline-block;
}
</style>
