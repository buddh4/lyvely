<script lang="ts" setup>
import EditHabitModal from '@/modules/activity/components/habits/EditHabitModal.vue';
import ActivityPlanList from '@/modules/activity/components/ActivityPlanList.vue';
import TimingList from '@/modules/timing/components/TimingList.vue';
import { ActivityType } from 'lyvely-common';
import { DialogExceptionHandler } from '@/modules/core/handler/exception.handler';
import { useActivityStore } from '@/modules/activity/store/activityStore';
import { computed, onBeforeMount } from 'vue';
import { getCalendarPlanArray } from 'lyvely-common';
import { useActivityEditStore } from '@/modules/activity/store/editActivityStore';

const type = ActivityType.Habit;

function createEntry() {
  useActivityEditStore().setCreateActivity(type);
}

const plans = computed(() => getCalendarPlanArray());

onBeforeMount(async () => {
  return useActivityStore().loadActivities().catch(DialogExceptionHandler('Could not load activities.'));
});
</script>

<template>
    <TimingList>
      <ActivityPlanList v-for="plan in plans" :key="plan" :plan="plan" :type="type" />
    </TimingList>

    <EditHabitModal />

    <a class="btn-add" @click="createEntry">+</a>
</template>

<style scoped>
.timing-list {
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
