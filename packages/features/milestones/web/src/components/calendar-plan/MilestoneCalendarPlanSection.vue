<script lang="ts" setup>
import MilestoneCalendarPlanItem from './MilestoneCalendarPlanItem.vue';
import { CalendarPlanSection } from '@lyvely/calendar-plan-web';
import { useMilestoneCalendarPlanStore } from '@/stores';
import { computed } from 'vue';
import Draggable from 'vuedraggable';

export interface IProps {
  interval: number;
}

const props = defineProps<IProps>();

const milestonePlanStore = useMilestoneCalendarPlanStore();
const { sort } = milestonePlanStore;

const milestones = computed(() => {
  return milestonePlanStore.getModels(props.interval);
});

const addEntry = () => milestonePlanStore.createItem(props.interval);
</script>

<template>
  <calendar-plan-section
    :interval="interval"
    :count="milestones.length"
    create-button-title="milestones.create.title"
    @create="addEntry">
    <draggable
      :list="milestones"
      tag="div"
      class="divide-y divide-divide"
      :data-calendar-interval="interval"
      group="milestones"
      handle=".icon-drag"
      item-key="id"
      @end="sort">
      <template #item="{ element }">
        <div>
          <milestone-calendar-plan-item :model="element" />
        </div>
      </template>
    </draggable>
  </calendar-plan-section>
</template>

<style scoped></style>
