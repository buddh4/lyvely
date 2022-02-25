<script lang="ts" setup>
import { VueDraggableNext } from "vue-draggable-next";
import ActivityPlanListEntry from "@/modules/activity/components/ActivityPlanListEntry.vue";
import CalendarPlanList from "@/modules/timing/components/CalendarPlanList.vue";
import { useActivityList } from '@/modules/activity/components/ActivityList';
import { ActivityType } from 'lyvely-common';

interface Props {
  plan: number,
  type: ActivityType
}

const props = defineProps<Props>();
const { activities, activityCount, dragEnd, onDateChanged } = useActivityList(props.plan, props.type);
</script>

<template>
  <CalendarPlanList :plan="props.plan" :count="activityCount" @changed="onDateChanged">
    <VueDraggableNext
      tag="ul"
      group="habits"
      class="divide-y divide-divide border-l-1 border-l border-r border-divide"
      :list="activities"
      handle=".icon-drag"
      @end="dragEnd">

      <ActivityPlanListEntry v-for="activity in activities" :key="activity.id" :model="activity"/>

    </VueDraggableNext>
  </CalendarPlanList>
</template>

<style scoped></style>
