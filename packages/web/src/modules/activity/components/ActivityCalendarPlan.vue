<script lang="ts" setup>
import ActivityPlanItem from "@/modules/activity/components/ActivityPlanItem.vue";
import CalendarPlanSection from "@/modules/calendar/components/CalendarPlanSection.vue";
import { ActivityType } from '@lyvely/common';
import { useTaskPlanStore } from "@/modules/activity/store/taskPlanStore";
import { useHabitPlanStore } from "@/modules/activity/store/habitPlanStore";
import { useActivityStore } from "@/modules/activity/store/activityStore";
import draggable from "vuedraggable";
import { useActivityEditStore } from "@/modules/activity/store/editActivityStore";
import { computed } from 'vue';

interface Props {
  interval: number,
  type: ActivityType
}

const props = defineProps<Props>();

const taskPlanStore = useTaskPlanStore();
const habitPlanStore = useHabitPlanStore();

const activities = computed(() => (props.type === ActivityType.Habit)
    ? habitPlanStore.getHabitsByCalendarInterval(props.interval)
    : taskPlanStore.getTasksByCalendarInterval(props.interval));


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
  useActivityEditStore().setCreateActivity(props.type, props.interval);
}

const createTitle = computed(() => (props.type === ActivityType.Habit) ? 'activities.habits.create.title' : 'activities.tasks.create.title' );
</script>

<template>
  <CalendarPlanSection :interval="interval" :count="activities.length" :create-button-title="$t(createTitle)" @create="addEntry">
    <draggable
        :list="activities"
        tag="div"
        class="calendar-plan-items divide-y divide-divide border-l border-l border-r border-divide"
        :data-calendar-interval="interval"
        group="habits"
        handle=".icon-drag"
        item-key="id"
        @end="dragEnd">

      <template #item="{element}">
        <div :data-cid="element.id">
          <ActivityPlanItem :model="element" />
        </div>
      </template>
    </draggable>
  </CalendarPlanSection>
</template>

<style scoped></style>
