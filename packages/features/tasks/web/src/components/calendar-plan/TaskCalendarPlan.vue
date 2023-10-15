<script lang="ts" setup>
import { CalendarPlanner, CalendarPlanFilterNavigation } from '@lyvely/calendar-plan-web';
import { TaskModel } from '@lyvely/tasks-interface';
import { getCalendarIntervalArray } from '@lyvely/dates';
import { usePageStore, translate, useContentCreateStore } from '@lyvely/web';
import TaskCalendarPlanSection from '@/components/calendar-plan/TaskCalendarPlanSection.vue';
import { useTaskCalendarPlanStore } from '@/stores';
import { onBeforeMount, onUnmounted } from 'vue';
import { LyFloatingAddButton } from '@lyvely/ui';

const { filter, loadModels, startWatch, reset } = useTaskCalendarPlanStore();
const createEntry = () => useContentCreateStore().createContentType(TaskModel.contentType);

usePageStore().setTitle([translate('tasks.title')]);

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
    <task-calendar-plan-section
      v-for="interval in getCalendarIntervalArray()"
      :key="interval"
      :interval="interval" />
  </calendar-planner>

  <ly-floating-add-button @click="createEntry" />
</template>
