<script lang="ts" setup>
import HabitCalendarPlanItem from '@/modules/habits/calendar-plan/components/HabitCalendarPlanItem.vue';
import CalendarPlanSection from '@/modules/calendar-plan/components/CalendarPlanSection.vue';
import { computed } from 'vue';
import Draggable from 'vuedraggable';
import { useContentCreateStore } from '@/modules/content/stores/content-create.store';
import { useHabitCalendarPlanStore } from '@/modules/habits/stores/habit-calendar-plan.store';
import { HabitModel } from '@lyvely/common';

export interface IProps {
  interval: number;
}

const props = defineProps<IProps>();

const habitPlanStore = useHabitCalendarPlanStore();
const { sort } = habitPlanStore;

const habits = computed(() => {
  return habitPlanStore.getHabits(props.interval);
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
      class="calendar-plan-items divide-y divide-divide border-x border-divide"
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
