<script lang="ts" setup>
import ActivityPlanList from '@/modules/activities/components/ActivityCalendarPlan.vue';
import CalendarPlan from '@/modules/calendar/components/CalendarPlan.vue';
import { ActivityType, getCalendarPlanArray } from '@lyvely/common';
import { computed } from 'vue';
import FloatingAddButton from '@/modules/ui/components/button/FloatingAddButton.vue';
import { useContentCreateStore } from '@/modules/content/stores/content-create.store';

const type = ActivityType.Habit;

const createEntry = () => useContentCreateStore().setCreateContent(type);
const intervals = computed(() => getCalendarPlanArray());
</script>

<template>
  <calendar-plan>
    <activity-plan-list
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
