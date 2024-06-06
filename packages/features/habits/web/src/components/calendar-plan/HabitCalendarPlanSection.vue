<script lang="ts" setup>
import HabitCalendarPlanItem from './HabitCalendarPlanItem.vue';
import { CalendarPlanSection } from '@lyvely/calendar-plan-web';
import { useHabitCalendarPlanStore } from '@/stores';
import { computed } from 'vue';
import Draggable from 'vuedraggable';

export interface IProps {
  interval: number;
}

const props = defineProps<IProps>();

const habitPlanStore = useHabitCalendarPlanStore();
const { sort } = habitPlanStore;

const habits = computed(() => {
  return habitPlanStore.getModels(props.interval);
});

const createItem = () => habitPlanStore.createItem(props.interval);
</script>

<template>
  <calendar-plan-section
    :interval="interval"
    :count="habits.length"
    create-button-title="habits.create.title"
    @create="createItem">
    <draggable
      :list="habits"
      tag="div"
      class="divide-y divide-divide"
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
