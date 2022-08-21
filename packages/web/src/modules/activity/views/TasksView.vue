<script lang="ts" setup>
import EditTaskModal from "@/modules/activity/components/tasks/EditTaskModal.vue";
import ActivityPlanList from '@/modules/activity/components/ActivityCalendarPlan.vue';
import TimingList from '@/modules/calendar/components/CalendarPlan.vue';
import { ActivityType , getCalendarPlanArray } from '@lyvely/common';
import { useActivityEditStore } from '@/modules/activity/store/editActivityStore';
import { computed, onBeforeMount } from 'vue';
import { useActivityStore } from '@/modules/activity/store/activityStore';
import { DialogExceptionHandler } from '@/modules/core/handler/exception.handler';

const type = ActivityType.Task;

function createEntry() {
  useActivityEditStore().setCreateActivity(type);
}

const intervals = computed(() => getCalendarPlanArray());
</script>

<template>
    <TimingList>
      <ActivityPlanList v-for="interval in intervals" :key="interval" :interval="interval" :type="type" />
    </TimingList>

    <EditTaskModal />

    <a class="btn-add" @click="createEntry">+</a>
</template>
