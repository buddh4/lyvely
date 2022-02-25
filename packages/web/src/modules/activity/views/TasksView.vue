<script lang="ts" setup>
import EditTaskModal from "@/modules/activity/components/tasks/EditTaskModal.vue";
import ActivityPlanList from '@/modules/activity/components/ActivityPlanList.vue';
import TimingList from '@/modules/timing/components/TimingList.vue';
import { ActivityType } from 'lyvely-common';
import { useActivityEditStore } from '@/modules/activity/store/editActivityStore';
import { computed, onBeforeMount } from 'vue';
import { useActivityStore } from '@/modules/activity/store/activityStore';
import { DialogExceptionHandler } from '@/modules/core/handler/exception.handler';
import { getCalendarPlanArray } from 'lyvely-common';

const type = ActivityType.Task;

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

    <EditTaskModal />

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
