<script lang="ts" setup>
import { TaskModel } from '@lyvely/tasks-interface';
import { computed } from 'vue';
import {
  CalendarPlanItem,
  useCalendarPlanItem,
  useCalendarPlanItemSort,
} from '@lyvely/calendar-plan-web';
import { useTaskCalendarPlanStore } from '@/stores';
import { TimerState, ContentDropdown } from '@lyvely/web';

export interface IProps {
  model: TaskModel;
}

const props = defineProps<IProps>();
const taskStore = useTaskCalendarPlanStore();
const { selectTag } = taskStore;

const { isDisabled } = useCalendarPlanItem(props.model);
const { moveUp, moveDown } = useCalendarPlanItemSort(props.model, taskStore);

const selection = computed({
  get: () => !!props.model.state.done,
  set: (val: boolean) => taskStore.setTaskSelection(props.model, val),
});

const startTimer = async () => taskStore.startTimer(props.model);
const stopTimer = async () => taskStore.stopTimer(props.model);
const updateTimer = async (value: number) => taskStore.updateTimer(props.model, value);
</script>

<template>
  <calendar-plan-item
    :model="model"
    :draggable="!props.model.state.done"
    @move-up="moveUp"
    @move-down="moveDown"
    @select-tag="selectTag">
    <template #menu>
      <content-dropdown :content="model" />
    </template>
    <template #pre-title>
      <div>
        <ly-checkbox v-model="selection" class="mr-2" :disabled="isDisabled" />
      </div>
    </template>

    <template #rating>
      <timer-state
        :key="model.state.timer.calculateTotalSpan()"
        :startable="!isDisabled"
        :model="model.state.timer"
        :show-time-on-init="!!model.state.done"
        @start="startTimer"
        @stop="stopTimer"
        @update="updateTimer" />
    </template>
  </calendar-plan-item>
</template>

<style scoped></style>
