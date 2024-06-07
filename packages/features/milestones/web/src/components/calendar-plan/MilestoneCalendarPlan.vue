<script lang="ts" setup>
import { usePageStore, translate, t, useProfilePermissions } from '@lyvely/web';
import { CalendarPlanner, CalendarPlanFilterNavigation } from '@lyvely/calendar-plan-web';
import { getCalendarIntervalArray } from '@lyvely/dates';
import { useMilestoneCalendarPlanStore } from '@/stores';
import { onBeforeMount, onUnmounted, ref } from 'vue';
import { LyAlert, LyContentPanel, LyFloatingAddButton, LyIcon } from '@lyvely/ui';
import MilestoneCalendarPlanSection from './MilestoneCalendarPlanSection.vue';
import { useMilestonePermissions } from '@lyvely/milestones-interface';

const calendarPlanStore = useMilestoneCalendarPlanStore();
const { filter, loadModels, startWatch, reset, createItem } = calendarPlanStore;

const { isEmpty } = calendarPlanStore;

usePageStore().setTitle([translate('milestones.title')]);

const loaded = ref(false);

const { isAllowed: canCreateMilestone } = useProfilePermissions(useMilestonePermissions().Create);

const createMilestone = () => {
  if (!canCreateMilestone.value) return;
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
    <milestone-calendar-plan-section
      v-for="interval in getCalendarIntervalArray()"
      :key="interval"
      :interval="interval" />
  </calendar-planner>
  <ly-content-panel v-else-if="loaded">
    <ly-alert
      :class="[{ 'cursor-pointer': canCreateMilestone }, 'justify-center bg-main']"
      :role="canCreateMilestone ? 'button' : ''"
      @click="createMilestone">
      <div class="flex flex-col items-center justify-center">
        <ly-icon name="target" class="w-20 text-gray-300 dark:text-gray-500" />
        <span v-if="canCreateMilestone" class="font-semibold">{{
          t('milestones.calendar-plan.empty-create')
        }}</span>
        <span v-else class="font-semibold">{{ t('milestones.calendar-plan.empty') }}</span>
      </div>
    </ly-alert>
  </ly-content-panel>

  <ly-floating-add-button v-if="canCreateMilestone" @click="createItem" />
</template>
