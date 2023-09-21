<script lang="ts" setup>
import { TaskModel } from '@lyvely/common';
import { computed } from 'vue';
import CalendarPlanItem from '@/modules/calendar-plan/components/CalendarPlanItem.vue';
import { useTaskCalendarPlanStore } from '@/modules/tasks/stores/task-calendar-plan.store';
import TimerState from '@/modules/calendar/components/TimerState.vue';
import ContentDropdown from '@/modules/content/components/ContentDropdown.vue';
import { useCalendarPlanPlanItem } from '@/modules/calendar-plan/composables/calendar-plan-item.composable';

export interface IProps {
  model: TaskModel;
}

const props = defineProps<IProps>();
const taskStore = useTaskCalendarPlanStore();
const { selectTag } = taskStore;

const { isDisabled, moveUp, moveDown } = useCalendarPlanPlanItem(props.model, taskStore);

const selection = computed({
  get: () => +!!props.model.done,
  set: (selection: number) => taskStore.setTaskSelection(props.model, !!selection),
});

const startTimer = async () => taskStore.startTimer(props.model);
const stopTimer = async () => taskStore.stopTimer(props.model);
const updateTimer = async (value: number) => taskStore.updateTimer(props.model, value);
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
    <template #pre-title>
      <div>
        <ly-checkbox-range
          v-model:selection="selection"
          :max="1"
          :is-task="true"
          :disabled="isDisabled" />
      </div>
    </template>

    <template #rating>
      <timer-state
        :key="model.timer.calculateTotalSpan()"
        :startable="!model.done"
        :model="model.timer"
        :show-time-on-init="!!model.done"
        @start="startTimer"
        @stop="stopTimer"
        @update="updateTimer" />
    </template>
  </calendar-plan-item>
</template>

<style scoped></style>
