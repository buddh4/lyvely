<script lang="ts" setup>
import { VueDraggableNext } from "vue-draggable-next";
import ActivityPlanListEntry from "@/modules/activity/components/ActivityPlanListEntry.vue";
import CalendarPlanList from "@/modules/timing/components/CalendarPlanList.vue";
import { ActivityType } from '@lyvely/common';
import { useActivityStore } from "@/modules/activity/store/activityStore";
import { computed } from 'vue';

interface Props {
  interval: number,
  type: ActivityType
}

const props = defineProps<Props>();

const activityStore = useActivityStore();

const activities = (props.type === ActivityType.Habit)
    ? computed(() => activityStore.habits(props.interval))
    : computed(() => activityStore.tasks(props.interval));

const activityCount = computed(() => activities.value.length);

function dragEnd(evt: any) {
  activityStore.move( {
    id: evt.item.dataset.activityId,
    newIndex: evt.newIndex,
    oldIndex: evt.oldIndex
  });
}

function onDateChanged() {
  activityStore.loadActivities();
}
</script>

<template>
  <CalendarPlanList :interval="props.interval" :count="activityCount" @changed="onDateChanged">
    <VueDraggableNext
      tag="ul"
      group="habits"
      class="timing-list-items"
      :list="activities"
      handle=".icon-drag"
      @end="dragEnd">

      <ActivityPlanListEntry v-for="activity in activities" :key="activity.id" :model="activity"/>

    </VueDraggableNext>
  </CalendarPlanList>
</template>

<style scoped></style>
