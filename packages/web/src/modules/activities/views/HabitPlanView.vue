<script lang="ts" setup>
import ActivityCalendarPlanSection from '@/modules/activities/components/ActivityCalendarPlanSection.vue';
import CalendarPlan from '@/modules/calendar-plan/components/CalendarPlan.vue';
import { ActivityType, getCalendarIntervalArray } from '@lyvely/common';
import FloatingAddButton from '@/modules/ui/components/button/FloatingAddButton.vue';
import { useContentCreateStore } from '@/modules/content/stores/content-create.store';

const type = ActivityType.Habit;

const createEntry = () => useContentCreateStore().createContentType(type);
const intervals = getCalendarIntervalArray();
</script>

<template>
  <calendar-plan>
    <activity-calendar-plan-section
      v-for="interval in intervals"
      :key="interval"
      :interval="interval"
      :type="type" />
  </calendar-plan>

  <floating-add-button @click="createEntry" />
</template>

<style scoped>
.calendar-plan-list {
  animation: fade-1 500ms 1;
}

@keyframes fade-1 {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
