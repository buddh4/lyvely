<script lang="ts" setup>
import TaskPlanItem from '@/modules/activities/components/TaskPlanItem.vue';
import HabitPlanItem from '@/modules/activities/components/HabitPlanItem.vue';
import CalendarPlanSection from '@/modules/calendar-plan/components/CalendarPlanSection.vue';
import { ActivityType, isTask } from '@lyvely/common';
import { useTaskPlanStore } from '@/modules/activities/store/task-plan.store';
import { useHabitPlanStore } from '@/modules/activities/store/habit-plan.store';
import { computed, ref } from 'vue';
import { useActivityStore } from '@/modules/activities/store/activity.store';
import Draggable from 'vuedraggable';
import { useContentCreateStore } from '@/modules/content/stores/content-create.store';
import { IDragEvent } from '@/modules/common';

export interface IProps {
  interval: number;
  type: string;
}

const props = defineProps<IProps>();

const activityStore = useActivityStore();
const taskPlanStore = useTaskPlanStore();
const habitPlanStore = useHabitPlanStore();

const showAll = ref(false);

const activities = computed(() => {
  return activityStore.getActivities(props.type, props.interval, showAll.value);
});

function dragEnd(evt: IDragEvent) {
  (props.type === ActivityType.Habit ? habitPlanStore : taskPlanStore).move(evt);
}

const addEntry = () =>
  useContentCreateStore().createContentType(props.type, { interval: props.interval });

const createTitle = computed(() =>
  props.type === ActivityType.Habit
    ? 'activities.habits.create.title'
    : 'activities.tasks.create.title',
);

const hasMore = computed(() => activityStore.isHasMore(props.interval));
const showMore = (value: boolean) => (showAll.value = value);
</script>

<template>
  <calendar-plan-section
    :interval="interval"
    :count="activities.length"
    :create-button-title="$t(createTitle)"
    @create="addEntry">
    <draggable
      :list="activities"
      tag="div"
      class="calendar-plan-items divide-y divide-divide border-x border-divide"
      :data-calendar-interval="interval"
      group="habits"
      handle=".icon-drag"
      item-key="id"
      @end="dragEnd">
      <template #item="{ element }">
        <div :data-cid="element.id">
          <task-plan-item v-if="isTask(element)" :model="element" />
          <habit-plan-item v-else :model="element" />
        </div>
      </template>
    </draggable>
    <div
      v-if="hasMore && !showAll"
      class="flex items-center justify-center bg-main p-2 divide-y divide-divide border-x border-t border-divide cursor-pointer"
      @click="showMore(true)">
      Show More
    </div>
    <div
      v-else-if="hasMore && showAll"
      class="flex items-center justify-center bg-main p-2 divide-y divide-divide border-x border-t border-divide cursor-pointer"
      @click="showMore(false)">
      Show Less
    </div>
  </calendar-plan-section>
</template>

<style scoped></style>
