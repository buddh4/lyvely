<script lang="ts" setup>
import HabitCalendarPlanItem from './HabitCalendarPlanItem.vue';
import { CalendarPlanSection } from '@lyvely/calendar-plan-web';
import { useHabitCalendarPlanStore } from '@/stores';
import { computed } from 'vue';
import Draggable from 'vuedraggable';
import { useContentCreateStore } from '@lyvely/web';
import { HabitModel } from '@lyvely/habits-interface';

export interface IProps {
  interval: number;
}

const props = defineProps<IProps>();

const habitPlanStore = useHabitCalendarPlanStore();
const { sort } = habitPlanStore;

const habits = computed(() => {
  return habitPlanStore.getModels(props.interval);
});

const addEntry = () =>
  useContentCreateStore().createContentType(HabitModel.contentType, { interval: props.interval });
</script>

<template>
  <calendar-plan-section
    :interval="interval"
    :count="habits.length"
    create-button-title="habits.create.title"
    @create="addEntry">
    <draggable
      :list="habits"
      tag="div"
      class="divide-divide divide-y"
      :data-calendar-interval="interval"
      group="habits"
      handle=".icon-drag"
      item-key="id"
      @end="sort">
      <template #item="{ element }">
        <div>
          <habit-calendar-plan-item :model="element" />
        </div>
      </template>
    </draggable>
  </calendar-plan-section>
</template>

<style scoped></style>
