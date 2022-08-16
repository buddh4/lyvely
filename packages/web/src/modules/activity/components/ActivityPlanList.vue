<script lang="ts" setup>
import ActivityPlanListEntry from "@/modules/activity/components/ActivityPlanListEntry.vue";
import CalendarPlanList from "@/modules/timing/components/CalendarPlanList.vue";
import { ActivityType } from '@lyvely/common';
import { computed } from 'vue';
import { useTaskPlanStore } from "@/modules/activity/store/taskPlanStore";
import { useHabitPlanStore } from "@/modules/activity/store/habitPlanStore";
import { useActivityStore } from "@/modules/activity/store/activityStore";
import draggable from "vuedraggable";

interface Props {
  interval: number,
  type: ActivityType
}

const props = defineProps<Props>();

const activityStore = useActivityStore();
const taskPlanStore = useTaskPlanStore();
const habitPlanStore = useHabitPlanStore();

const activities = (props.type === ActivityType.Habit)
    ? habitPlanStore.getHabitsByCalendarInterval(props.interval)
    : taskPlanStore.getTasksByCalendarInterval(props.interval);

console.log(activities);

const activityCount = computed(() => activities?.value.length ?? 0);

function dragEnd(evt: any) {
  const store = (props.type === ActivityType.Habit) ? habitPlanStore : taskPlanStore;
  /*store.move(activities.value, {
    id: evt.item.dataset.activityId,
    newIndex: evt.newIndex,
    oldIndex: evt.oldIndex
  });*/
}

function onDateChanged() {
  activityStore.loadActivities();
}
</script>

<template>
  <CalendarPlanList :interval="props.interval" :count="activities.length" @changed="onDateChanged">
    <draggable
        :list="activities"
        tag="ul"
        class="timing-list-items"
        group="habits"
        handle=".icon-drag"
        item-key="id"
        @end="dragEnd">

      <template #item="{element}">
        <ActivityPlanListEntry :model="element"/>
      </template>

    </draggable>
  </CalendarPlanList>
</template>

<style scoped></style>
