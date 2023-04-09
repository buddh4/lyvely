<script lang="ts" setup>
import { MilestoneModel } from '@lyvely/common';
import CalendarPlanItem from '@/modules/calendar-plan/components/CalendarPlanItem.vue';
import { useMilestoneCalendarPlanStore } from '@/modules/milestones/stores/milestone-calendar-plan.store';
import ContentDropdown from '@/modules/content/components/ContentDropdown.vue';
import { useCalendarPlanPlanItem } from '@/modules/calendar-plan/composables/calendar-plan-item.composable';

export interface IProps {
  model: MilestoneModel;
}

const props = defineProps<IProps>();
const milestoneStore = useMilestoneCalendarPlanStore();
const { selectTag } = milestoneStore;

const { moveUp, moveDown } = useCalendarPlanPlanItem(props.model, milestoneStore);
</script>

<template>
  <calendar-plan-item
    :model="model"
    @move-up="moveUp"
    @move-down="moveDown"
    @select-tag="selectTag">
    <template #menu>
      <content-dropdown :content="model" />
    </template>
    <template #rating>
      {{ model }}
    </template>
  </calendar-plan-item>
</template>

<style scoped></style>
