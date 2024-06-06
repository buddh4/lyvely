<script lang="ts" setup>
import TaskCalendarPlanItem from './TaskCalendarPlanItem.vue';
import { CalendarPlanSection } from '@lyvely/calendar-plan-web';
import { useTaskCalendarPlanStore } from '@/stores';
import { computed, ref } from 'vue';
import Draggable from 'vuedraggable';

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

const createItem = () => taskPlanStore.createItem(props.interval);

const hasMore = computed(() => taskPlanStore.isHasMore(props.interval));
const showMore = (value: boolean) => (showAll.value = value);
</script>

<template>
  <calendar-plan-section
    :interval="interval"
    :count="tasks.length"
    create-button-title="tasks.create.title"
    @create="createItem">
    <draggable
      :list="tasks"
      tag="div"
      class="divide-y divide-divide"
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
      class="flex cursor-pointer items-center justify-center divide-y divide-divide border-x border-t border-divide bg-main p-2"
      @click="showMore(true)">
      Show More
    </div>
    <div
      v-else-if="hasMore && showAll"
      class="flex cursor-pointer items-center justify-center divide-y divide-divide border-x border-t border-divide bg-main p-2"
      @click="showMore(false)">
      Show Less
    </div>
  </calendar-plan-section>
</template>

<style scoped></style>
