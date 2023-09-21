<script lang="ts" setup>
import CalendarPlan from '@/modules/calendar-plan/components/CalendarPlan.vue';
import { getCalendarIntervalArray, TaskModel } from '@lyvely/common';
import { usePageStore } from '@/modules/core/store/page.store';
import { useContentCreateStore } from '@/modules/content/stores/content-create.store';
import { translate } from '@/i18n';
import TaskCalendarPlanSection from '@/modules/tasks/components/calendar-plan/TaskCalendarPlanSection.vue';
import { useTaskCalendarPlanStore } from '@/modules/tasks/stores/task-calendar-plan.store';
import CalendarPlanFilterNavigation from '@/modules/calendar-plan/components/CalendarPlanFilterNavigation.vue';
import { onBeforeMount, onUnmounted } from 'vue';

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
  <calendar-plan>
    <task-calendar-plan-section
      v-for="interval in getCalendarIntervalArray()"
      :key="interval"
      :interval="interval" />
  </calendar-plan>

  <ly-floating-add-button @click="createEntry" />
</template>
