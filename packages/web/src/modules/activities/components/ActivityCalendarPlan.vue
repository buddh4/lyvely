<script lang="ts" setup>
import TaskPlanItem from '@/modules/activities/components/TaskPlanItem.vue';
import HabitPlanItem from '@/modules/activities/components/HabitPlanItem.vue';
import CalendarPlanSection from '@/modules/calendar/components/CalendarPlanSection.vue';
import { ActivityType, isTask } from '@lyvely/common';
import { useTaskPlanStore } from '@/modules/activities/store/task-plan.store';
import { useHabitPlanStore } from '@/modules/activities/store/habit-plan.store';
import { useUpdateActivityStore } from '@/modules/activities/store/update-activity.store';
import { computed } from 'vue';
import { useActivityStore } from '@/modules/activities/store/activity.store';
import draggable from 'vuedraggable';

export interface IProps {
  interval: number;
  type: ActivityType;
}

const props = defineProps<IProps>();

const activityStore = useActivityStore();
const taskPlanStore = useTaskPlanStore();
const habitPlanStore = useHabitPlanStore();

//const activities = computed(() => activityStore.getActivities(props.type, props.interval));

const activities = computed(() => activityStore.getActivities(props.type, props.interval));

interface IDragEvent {
  from: HTMLElement;
  to: HTMLElement;
  item: HTMLElement;
  oldIndex: number;
  newIndex: number;
}

function dragEnd(evt: IDragEvent) {
  const store = props.type === ActivityType.Habit ? habitPlanStore : taskPlanStore;
  store.move({
    cid: evt.item.dataset.cid as string,
    fromInterval: parseInt(evt.from.dataset.calendarInterval as string),
    toInterval: parseInt(evt.to.dataset.calendarInterval as string),
    newIndex: evt.newIndex,
    oldIndex: evt.oldIndex,
  });
}

function addEntry() {
  useUpdateActivityStore().setCreateActivity(props.type, props.interval);
}

const createTitle = computed(() =>
  props.type === ActivityType.Habit ? 'activities.habits.create.title' : 'activities.tasks.create.title',
);
</script>

<template>
  <calendar-plan-section
    :interval="interval"
    :count="activities.length"
    :create-button-title="$t(createTitle)"
    @create="addEntry"
  >
    <draggable
      :list="activities"
      tag="div"
      class="calendar-plan-items divide-y divide-divide border-l border-l border-r border-divide"
      :data-calendar-interval="interval"
      group="habits"
      handle=".icon-drag"
      item-key="id"
      @end="dragEnd"
    >
      <template #item="{ element }">
        <div :data-cid="element.id">
          <task-plan-item v-if="isTask(element)" :model="element" />
          <habit-plan-item v-else :model="element" />
        </div>
      </template>
    </draggable>
  </calendar-plan-section>
</template>

<style scoped></style>
