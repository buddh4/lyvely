<script lang="ts" setup>
import { CalendarPlanner, CalendarPlanFilterNavigation } from '@lyvely/calendar-plan-web';
import { getCalendarIntervalArray } from '@lyvely/dates';
import { usePageStore, t, useProfilePermissions } from '@lyvely/web';
import TaskCalendarPlanSection from '@/components/calendar-plan/TaskCalendarPlanSection.vue';
import { useTaskCalendarPlanStore } from '@/stores';
import { onBeforeMount, onUnmounted, ref } from 'vue';
import { LyAlert, LyContentPanel, LyFloatingAddButton, LyIcon } from '@lyvely/ui';
import { useTaskPermissions } from '@lyvely/tasks-interface';

const calendarPlanStore = useTaskCalendarPlanStore();
const { filter, loadModels, startWatch, reset } = calendarPlanStore;

const createItem = () => {
  calendarPlanStore.createItem();
};

const { isEmpty } = calendarPlanStore;

usePageStore().setTitle([t('tasks.title')]);

const loaded = ref(false);

const { isAllowed: canCreateTask } = useProfilePermissions(useTaskPermissions().Create);

const createTask = () => {
  if (!canCreateTask.value) return;
  createItem();
};

onBeforeMount(() => loadModels().then(() => (loaded.value = true)));
const unwatch = startWatch();
onUnmounted(() => {
  unwatch();
  reset();
});
</script>

<template>
  <calendar-plan-filter-navigation :filter="filter" />
  <calendar-planner v-if="!isEmpty()">
    <task-calendar-plan-section
      v-for="interval in getCalendarIntervalArray()"
      :key="interval"
      :interval="interval" />
  </calendar-planner>
  <ly-content-panel v-else-if="loaded">
    <ly-alert
      :class="[{ 'cursor-pointer': canCreateTask }, 'justify-center bg-main']"
      :role="canCreateTask ? 'button' : ''"
      @click="createTask">
      <div class="flex flex-col items-center justify-center">
        <ly-icon name="task" class="w-20 text-gray-300 dark:text-gray-500" />
        <span v-if="canCreateTask" class="font-semibold">{{
          t('tasks.calendar-plan.empty-create')
        }}</span>
        <span v-else class="font-semibold">{{ t('tasks.calendar-plan.empty') }}</span>
      </div>
    </ly-alert>
  </ly-content-panel>

  <ly-floating-add-button v-if="canCreateTask" @click="createItem" />
</template>
