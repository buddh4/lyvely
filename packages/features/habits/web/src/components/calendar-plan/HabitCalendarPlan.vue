<script lang="ts" setup>
import { CalendarPlanner, CalendarPlanFilterNavigation } from '@lyvely/calendar-plan-web';
import { HabitModel } from '@lyvely/habits-interface';
import { getCalendarIntervalArray } from '@lyvely/dates';
import { useHabitCalendarPlanStore } from '@/stores';
import HabitCalendarPlanSection from './HabitCalendarPlanSection.vue';
import { onBeforeMount, onUnmounted, ref } from 'vue';
import { usePageStore, t, useContentCreateStore } from '@lyvely/web';
import { LyFloatingAddButton, LyContentPanel, LyAlert, LyButton, LyIcon } from '@lyvely/ui';

const calendarPlanStore = useHabitCalendarPlanStore();
const { filter, loadModels, startWatch, reset } = calendarPlanStore;
const createEntry = () => useContentCreateStore().createContentType(HabitModel.contentType);

const { isEmpty } = calendarPlanStore;

usePageStore().setTitle([t('habits.title')]);

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
    <habit-calendar-plan-section
      v-for="interval in getCalendarIntervalArray()"
      :key="interval"
      :interval="interval" />
  </calendar-planner>
  <ly-content-panel v-else-if="loaded">
    <ly-alert class="bg-main cursor-pointer justify-center" @click="createEntry">
      <div class="flex flex-col items-center justify-center">
        <ly-icon name="activity" class="w-20 cursor-pointer text-gray-300 dark:text-gray-500" />
        <ly-button class="font-semibold">
          {{ t('habits.calendar-plan.empty') }}
        </ly-button>
      </div>
    </ly-alert>
  </ly-content-panel>

  <ly-floating-add-button @click="createEntry" />
</template>
