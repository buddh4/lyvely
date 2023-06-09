<script lang="ts" setup>
import CalendarPlan from '@/modules/calendar-plan/components/CalendarPlan.vue';
import { getCalendarIntervalArray, MilestoneModel } from '@lyvely/common';
import { usePageStore } from '@/modules/core/store/page.store';
import FloatingAddButton from '@/modules/ui/components/button/FloatingAddButton.vue';
import { useContentCreateStore } from '@/modules/content/stores/content-create.store';
import { translate } from '@/i18n';
import { useMilestoneCalendarPlanStore } from '@/modules/milestones/stores/milestone-calendar-plan.store';
import CalendarPlanFilterNavigation from '@/modules/calendar-plan/components/CalendarPlanFilterNavigation.vue';
import { onBeforeMount, onUnmounted } from 'vue';
import MilestoneCalendarPlanSection from '@/modules/milestones/components/calendar-plan/MilestoneCalendarPlanSection.vue';

const { filter, loadModels, startWatch, reset } = useMilestoneCalendarPlanStore();
const createEntry = () => useContentCreateStore().createContentType(MilestoneModel.contentType);

usePageStore().setTitle([translate('milestones.title')]);

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
    <milestone-calendar-plan-section
      v-for="interval in getCalendarIntervalArray()"
      :key="interval"
      :interval="interval" />
  </calendar-plan>

  <ly-floating-add-button @click="createEntry" />
</template>
