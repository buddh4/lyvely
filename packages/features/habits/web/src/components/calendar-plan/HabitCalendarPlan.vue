<script lang="ts" setup>
import { CalendarPlanner, CalendarPlanFilterNavigation } from '@lyvely/calendar-plan-web';
import { getCalendarIntervalArray } from '@lyvely/dates';
import { useHabitCalendarPlanStore } from '@/stores';
import HabitCalendarPlanSection from './HabitCalendarPlanSection.vue';
import { onBeforeMount, onUnmounted, ref } from 'vue';
import { usePageStore, t, useProfilePermissions } from '@lyvely/web';
import { useHabitPermissions } from '@lyvely/habits-interface';
import { LyFloatingAddButton, LyContentPanel, LyAlert, LyIcon } from '@lyvely/ui';

const calendarPlanStore = useHabitCalendarPlanStore();
const { filter, loadModels, startWatch, reset, createItem } = calendarPlanStore;

const { isEmpty } = calendarPlanStore;

usePageStore().setTitle([t('habits.title')]);

const loaded = ref(false);

const { isAllowed: canCreateHabit } = useProfilePermissions(useHabitPermissions().Create);

const createHabit = () => {
  if (!canCreateHabit.value) return;
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
    <habit-calendar-plan-section
      v-for="interval in getCalendarIntervalArray()"
      :key="interval"
      :interval="interval" />
  </calendar-planner>
  <ly-content-panel v-else-if="loaded">
    <ly-alert
      :class="[{ 'cursor-pointer': canCreateHabit }, 'justify-center bg-main']"
      :role="canCreateHabit ? 'button' : ''"
      @click="createHabit">
      <div class="flex flex-col items-center justify-center">
        <ly-icon name="target" class="w-20 text-gray-300 dark:text-gray-500" />
        <span v-if="canCreateHabit" class="font-semibold">{{
          t('habits.calendar-plan.empty-create')
        }}</span>
        <span v-else class="font-semibold">{{ t('habits.calendar-plan.empty') }}</span>
      </div>
    </ly-alert>
  </ly-content-panel>

  <ly-floating-add-button @click="createItem" />
</template>
