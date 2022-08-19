<script lang="ts" setup>
import ActivityPlanListEntry from "@/modules/activity/components/ActivityPlanListEntry.vue";
import CalendarPlanList from "@/modules/calendar/components/CalendarPlanList.vue";
import { ActivityType } from '@lyvely/common';
import { useTaskPlanStore } from "@/modules/activity/store/taskPlanStore";
import { useHabitPlanStore } from "@/modules/activity/store/habitPlanStore";
import { useActivityStore } from "@/modules/activity/store/activityStore";
import draggable from "vuedraggable";
import { useActivityEditStore } from "@/modules/activity/store/editActivityStore";

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


interface DragEvent {
  from: HTMLElement,
  to: HTMLElement,
  item: HTMLElement,
  oldIndex: number,
  newIndex: number,
}

function dragEnd(evt: DragEvent) {
  const store = (props.type === ActivityType.Habit) ? habitPlanStore : taskPlanStore;
  store.move({
    cid: evt.item.dataset.cid as string,
    fromInterval: parseInt(evt.from.dataset.calendarInterval as string),
    toInterval: parseInt(evt.to.dataset.calendarInterval as string),
    newIndex: evt.newIndex,
    oldIndex: evt.oldIndex,
  });
}

function addEntry() {
  console.log('TEST');
  useActivityEditStore().setCreateActivity(props.type, props.interval);
}

function onDateChanged() {
  activityStore.loadActivities();
}
</script>

<template>
  <CalendarPlanList :interval="interval" :count="activities.length" @changed="onDateChanged" @create="addEntry">
    <draggable
        :list="activities"
        tag="div"
        class="timing-list-items"
        :data-calendar-interval="interval"
        group="habits"
        handle=".icon-drag"
        item-key="id"
        @end="dragEnd">

      <template #item="{element}">
        <div :data-cid="element.id">
          <ActivityPlanListEntry :model="element" />
        </div>
      </template>
q
    </draggable>
  </CalendarPlanList>
</template>

<style scoped></style>
