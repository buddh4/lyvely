<script lang="ts" setup>
import { CalendarPlanner, CalendarPlanFilterNavigation } from '@lyvely/calendar-plan-web';
import { HabitModel } from '@lyvely/habits-interface';
import { getCalendarIntervalArray } from '@lyvely/dates';
import { useHabitCalendarPlanStore } from '@/stores';
import HabitCalendarPlanSection from './HabitCalendarPlanSection.vue';
import { onBeforeMount, onUnmounted } from 'vue';
import { usePageStore, t, useContentCreateStore } from '@lyvely/web';
import { LyFloatingAddButton } from '@lyvely/ui';

const { filter, loadModels, startWatch, reset } = useHabitCalendarPlanStore();
const createEntry = () => useContentCreateStore().createContentType(HabitModel.contentType);

usePageStore().setTitle([t('habits.title')]);

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
    <habit-calendar-plan-section
      v-for="interval in getCalendarIntervalArray()"
      :key="interval"
      :interval="interval" />
  </calendar-planner>

  <ly-floating-add-button @click="createEntry" />
</template>
