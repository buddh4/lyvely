<script lang="ts" setup>
import EditTaskModal from '@/modules/activities/components/modals/EditTaskModal.vue';
import ActivityPlanList from '@/modules/activities/components/ActivityCalendarPlan.vue';
import TimingList from '@/modules/calendar/components/CalendarPlan.vue';
import { ActivityType, getCalendarPlanArray } from '@lyvely/common';
import { useUpdateActivityStore } from '@/modules/activities/store/update-activity.store';
import { computed } from 'vue';
import { usePageStore } from '@/modules/core/store/page.store';
import FloatingAddButton from '@/modules/ui/components/button/FloatingAddButton.vue';

const type = ActivityType.Task;

function createEntry() {
  useUpdateActivityStore().setCreateActivity(type);
}

const intervals = computed(() => getCalendarPlanArray());

usePageStore().setTitle(['Tasks']);
</script>

<template>
  <timing-list>
    <activity-plan-list v-for="interval in intervals" :key="interval" :interval="interval" :type="type" />
  </timing-list>

  <edit-task-modal />

  <floating-add-button @click="createEntry" />
</template>
