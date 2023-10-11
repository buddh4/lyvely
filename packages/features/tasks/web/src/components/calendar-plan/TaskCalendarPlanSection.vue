<script lang="ts" setup>
import TaskCalendarPlanItem from '@/modules/tasks/components/calendar-plan/TaskCalendarPlanItem.vue';
import CalendarPlanSection from '@/modules/calendar-plan/components/CalendarPlanSection.vue';
import { useTaskCalendarPlanStore } from '@/modules/tasks/stores/task-calendar-plan.store';
import { computed, ref } from 'vue';
import Draggable from 'vuedraggable';
import { useContentCreateStore } from '@/modules/content/stores/content-create.store';
import { TaskModel } from '@lyvely/tasks-interface';

export interface IProps {
  interval: number;
}

const props = defineProps<IProps>();

const taskPlanStore = useTaskCalendarPlanStore();
const { sort } = taskPlanStore;
const showAll = ref(false);

const tasks = computed(() => {
  return taskPlanStore.getTasks(props.interval, showAll.value);
});

const addEntry = () =>
  useContentCreateStore().createContentType(TaskModel.contentType, { interval: props.interval });

const hasMore = computed(() => taskPlanStore.isHasMore(props.interval));
const showMore = (value: boolean) => (showAll.value = value);
</script>

<template>
  <calendar-plan-section
    :interval="interval"
    :count="tasks.length"
    create-button-title="tasks.create.title"
    @create="addEntry">
    <draggable
      :list="tasks"
      tag="div"
      class="calendar-plan-items divide-y divide-divide border-x border-divide"
      :data-calendar-interval="interval"
      group="tasks"
      handle=".icon-drag"
      item-key="id"
      @end="sort">
      <template #item="{ element }">
        <div>
          <task-calendar-plan-item :model="element" />
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