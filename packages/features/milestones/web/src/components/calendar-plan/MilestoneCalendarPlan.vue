<script lang="ts" setup>
import { usePageStore, translate, useContentCreateStore } from '@lyvely/web';
import { CalendarPlanner, CalendarPlanFilterNavigation } from '@lyvely/calendar-plan-web';
import { MilestoneModel } from '@lyvely/milestones-interface';
import { getCalendarIntervalArray } from '@lyvely/dates';
import { useMilestoneCalendarPlanStore } from '@/stores';
import { onBeforeMount, onUnmounted } from 'vue';
import { LyFloatingAddButton } from '@lyvely/ui';
import MilestoneCalendarPlanSection from './MilestoneCalendarPlanSection.vue';

const { filter, loadModels, startWatch, reset } = useMilestoneCalendarPlanStore();
const createEntry = () => useContentCreateStore().createContentType(MilestoneModel.contentType);

usePageStore().setTitle([translate('milestones.title')]);

onBeforeMount(() => loadModels());
const unwatch = startWatch();
onUnmounted(() => {
  unwatch();
  reset();
});
</script>

<template>
  <calendar-plan-filter-navigation :filter="filter" />
  <calendar-planner>
    <milestone-calendar-plan-section
      v-for="interval in getCalendarIntervalArray()"
      :key="interval"
      :interval="interval" />
  </calendar-planner>

  <ly-floating-add-button @click="createEntry" />
</template>
