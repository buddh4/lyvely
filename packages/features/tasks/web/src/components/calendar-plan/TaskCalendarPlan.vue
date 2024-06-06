<script lang="ts" setup>
import { CalendarPlanner, CalendarPlanFilterNavigation } from '@lyvely/calendar-plan-web';
import { getCalendarIntervalArray } from '@lyvely/dates';
import { usePageStore, t } from '@lyvely/web';
import TaskCalendarPlanSection from '@/components/calendar-plan/TaskCalendarPlanSection.vue';
import { useTaskCalendarPlanStore } from '@/stores';
import { onBeforeMount, onUnmounted, ref } from 'vue';
import { LyAlert, LyButton, LyContentPanel, LyFloatingAddButton, LyIcon } from '@lyvely/ui';

const calendarPlanStore = useTaskCalendarPlanStore();
const { filter, loadModels, startWatch, reset } = calendarPlanStore;

const createItem = () => {
  debugger;
  calendarPlanStore.createItem();
};

const { isEmpty } = calendarPlanStore;

usePageStore().setTitle([t('tasks.title')]);

const loaded = ref(false);

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
    <ly-alert class="cursor-pointer justify-center bg-main" @click="createItem">
      <div class="flex flex-col items-center justify-center">
        <ly-icon name="task" class="w-20 cursor-pointer text-gray-300 dark:text-gray-500" />
        <ly-button class="font-semibold">
          {{ t('tasks.calendar-plan.empty') }}
        </ly-button>
      </div>
    </ly-alert>
  </ly-content-panel>

  <ly-floating-add-button @click="createItem" />
</template>
