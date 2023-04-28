<script lang="ts" setup>
import CalendarPlan from '@/modules/calendar-plan/components/CalendarPlan.vue';
import { getCalendarIntervalArray, HabitModel } from '@lyvely/common';
import FloatingAddButton from '@/modules/ui/components/button/FloatingAddButton.vue';
import { useContentCreateStore } from '@/modules/content/stores/content-create.store';
import CalendarPlanFilterNavigation from '@/modules/calendar-plan/components/CalendarPlanFilterNavigation.vue';
import { useHabitCalendarPlanStore } from '@/modules/habits/stores/habit-calendar-plan.store';
import HabitCalendarPlanSection from '@/modules/habits/components/calendar-plan/HabitCalendarPlanSection.vue';
import { onBeforeMount, onUnmounted } from 'vue';
import { usePageStore } from '@/modules/core/store/page.store';
import { translate } from '@/i18n';

const { filter, loadModels, startWatch, reset } = useHabitCalendarPlanStore();
const createEntry = () => useContentCreateStore().createContentType(HabitModel.contentType);

usePageStore().setTitle([translate('habits.title')]);

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
    <habit-calendar-plan-section
      v-for="interval in getCalendarIntervalArray()"
      :key="interval"
      :interval="interval" />
  </calendar-plan>

  <floating-add-button @click="createEntry" />
</template>
