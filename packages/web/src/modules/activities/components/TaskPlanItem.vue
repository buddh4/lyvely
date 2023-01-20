<script lang="ts" setup>
import ItemCheckboxList from '@/modules/activities/components/ItemCheckboxList.vue';
import { TaskModel, TimerModel } from '@lyvely/common';
import { useActivityStore } from '@/modules/activities/store/activity.store';
import { computed } from 'vue';
import CalendarPlanItem from '@/modules/calendar/components/CalendarPlanItem.vue';
import { useTaskPlanStore } from '@/modules/activities/store/task-plan.store';
import TimerState from '@/modules/calendar/components/TimerState.vue';
import { useActivityPlanItem } from '@/modules/activities/composables/useActivityPlanItem';
import ContentDropdown from '@/modules/content/components/ContentDropdown.vue';

export interface IProps {
  model: TaskModel;
}

const props = defineProps<IProps>();
const taskStore = useTaskPlanStore();

const { isDisabled, moveUp, moveDown } = useActivityPlanItem(props.model);
const { selectTag } = useActivityStore();

const selection = computed({
  get: () => +!!props.model.done,
  set: (selection: number) => taskStore.setTaskSelection(props.model, !!selection),
});
async function startTimer() {
  return taskStore.startTimer(props.model);
}

async function stopTimer() {
  return taskStore.stopTimer(props.model);
}

async function updateTimer(value: number) {
  return taskStore.updateTimer(props.model, value);
}
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
      <div class="mr-1">
        <item-checkbox-list
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
