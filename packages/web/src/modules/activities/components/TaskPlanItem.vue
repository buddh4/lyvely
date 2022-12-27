<script lang="ts" setup>
import ItemCheckboxList from '@/modules/activities/components/ItemCheckboxList.vue';
import { TaskModel, TimerModel } from '@lyvely/common';
import { useActivityStore } from '@/modules/activities/store/activity.store';
import { computed } from 'vue';
import CalendarPlanItem from '@/modules/calendar/components/CalendarPlanItem.vue';
import { useUpdateActivityStore } from '@/modules/activities/store/update-activity.store';
import { useTaskPlanStore } from '@/modules/activities/store/task-plan.store';
import TimerState from '@/modules/calendar/components/TimerState.vue';
import { useActivityPlanItem } from '@/modules/activities/components/composables/useActivityPlanItem';

export interface IProps {
  model: TaskModel;
}

const props = defineProps<IProps>();
const taskStore = useTaskPlanStore();

const { isDisabled, moveUp, moveDown } = useActivityPlanItem(props.model);
const { toggleArchiveActivity, selectTag } = useActivityStore();
const { setEditActivity } = useUpdateActivityStore();

const selection = computed({
  get: () => +!!props.model.done,
  set: (selection: number) => taskStore.setTaskSelection(props.model, !!selection),
});
async function startTimer() {
  taskStore.startTimer(props.model);
}

async function stopTimer() {
  taskStore.stopTimer(props.model);
}

async function updateTimer(value: number) {
  taskStore.updateTimer(props.model, value);
}
</script>

<template>
  <calendar-plan-item
    :model="model"
    @archive="toggleArchiveActivity"
    @edit="setEditActivity"
    @move-up="moveUp"
    @move-down="moveDown"
    @select-tag="selectTag">
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
        :model="model.timer"
        :show-time-on-init="false"
        @start="startTimer"
        @stop="stopTimer"
        @update="updateTimer" />
    </template>
  </calendar-plan-item>
</template>

<style scoped></style>
