<script lang="ts" setup>
import EditHabitModal from '@/modules/activities/components/habits/EditHabitModal.vue';
import ActivityPlanList from '@/modules/activities/components/ActivityCalendarPlan.vue';
import CalendarPlan from '@/modules/calendar/components/CalendarPlan.vue';
import { ActivityType, getCalendarPlanArray } from '@lyvely/common';
import { computed } from 'vue';
import { useActivityEditStore } from '@/modules/activities/store/edit-activity.store';
import FloatingAddButton from '@/modules/ui/components/button/FloatingAddButton.vue';

const type = ActivityType.Habit;

function createEntry() {
  useActivityEditStore().setCreateActivity(type);
}

const intervals = computed(() => getCalendarPlanArray());
</script>

<template>
  <calendar-plan>
    <activity-plan-list v-for="interval in intervals" :key="interval" :interval="interval" :type="type" />
  </calendar-plan>

  <edit-habit-modal />

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
