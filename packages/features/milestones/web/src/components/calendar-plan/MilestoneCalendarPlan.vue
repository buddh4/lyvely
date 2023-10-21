<script lang="ts" setup>
import { usePageStore, translate, useContentCreateStore, t } from '@lyvely/web';
import { CalendarPlanner, CalendarPlanFilterNavigation } from '@lyvely/calendar-plan-web';
import { MilestoneModel } from '@lyvely/milestones-interface';
import { getCalendarIntervalArray } from '@lyvely/dates';
import { useMilestoneCalendarPlanStore } from '@/stores';
import { onBeforeMount, onUnmounted, ref } from 'vue';
import { LyAlert, LyButton, LyContentPanel, LyFloatingAddButton, LyIcon } from '@lyvely/ui';
import MilestoneCalendarPlanSection from './MilestoneCalendarPlanSection.vue';

const calendarPlanStore = useMilestoneCalendarPlanStore();
const { filter, loadModels, startWatch, reset } = calendarPlanStore;
const createEntry = () => useContentCreateStore().createContentType(MilestoneModel.contentType);

const { isEmpty } = calendarPlanStore;

usePageStore().setTitle([translate('milestones.title')]);

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
    <milestone-calendar-plan-section
      v-for="interval in getCalendarIntervalArray()"
      :key="interval"
      :interval="interval" />
  </calendar-planner>
  <ly-content-panel v-else-if="loaded">
    <ly-alert class="justify-center cursor-pointer" @click="createEntry">
      <div class="flex flex-col justify-center items-center">
        <ly-icon name="target" class="w-20 cursor-pointer text-gray-300 dark:text-gray-500" />
        <ly-button class="font-semibold">
          {{ t('milestones.calendar-plan.empty') }}
        </ly-button>
      </div>
    </ly-alert>
  </ly-content-panel>

  <ly-floating-add-button @click="createEntry" />
</template>
