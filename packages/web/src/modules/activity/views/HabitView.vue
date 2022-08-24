<script lang="ts" setup>
import EditHabitModal from '@/modules/activity/components/habits/EditHabitModal.vue';
import ActivityPlanList from '@/modules/activity/components/ActivityCalendarPlan.vue';
import CalendarPlan from '@/modules/calendar/components/CalendarPlan.vue';
import { ActivityType , getCalendarPlanArray } from '@lyvely/common';
import { computed } from 'vue';
import { useActivityEditStore } from '@/modules/activity/store/editActivityStore';

const type = ActivityType.Habit;

function createEntry() {
  useActivityEditStore().setCreateActivity(type);
}

const intervals = computed(() => getCalendarPlanArray());
</script>

<template>
    <CalendarPlan>
      <ActivityPlanList v-for="interval in intervals" :key="interval" :interval="interval" :type="type" />
    </CalendarPlan>

    <EditHabitModal />

    <a class="btn-add" @click="createEntry">+</a>
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
