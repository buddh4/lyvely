<script lang="ts" setup>
import { HabitModel } from '@lyvely/habits-interface';
import {
  isNumberDataPointConfig,
  isTimerDataPointConfig,
  TimeSeriesNumberInput,
  TimeSeriesTimerInput,
} from '@lyvely/time-series-web';
import { onMounted, ref } from 'vue';
import {
  CalendarPlanItem,
  useCalendarPlanItem,
  useCalendarPlanItemSort,
} from '@lyvely/calendar-plan-web';
import { useHabitCalendarPlanStore } from '@/stores';
import { ContentDropdown } from '@lyvely/web';
import { useUpdateHabit } from '@/composables';

export interface IProps {
  model: HabitModel;
}

const props = defineProps<IProps>();
const initialized = ref(false);
const habitStore = useHabitCalendarPlanStore();
const { selectTag, getDataPoint } = habitStore;
const { isDisabled } = useCalendarPlanItem(props.model);
const { moveUp, moveDown } = useCalendarPlanItemSort(props.model, habitStore);
const { selection, startTimer, stopTimer, timer, isTimerStartable } = useUpdateHabit(props.model);

const timerSelection = <any>selection;

onMounted(async () => {
  await getDataPoint(props.model);
  initialized.value = true;
});
</script>

<template>
  <calendar-plan-item
    v-if="initialized"
    :model="model"
    @move-up="moveUp"
    @move-down="moveDown"
    @select-tag="selectTag">
    <template #menu>
      <content-dropdown :content="model" />
    </template>
    <template #rating>
      <time-series-number-input
        v-if="isNumberDataPointConfig(model.timeSeriesConfig)"
        v-model="selection"
        :config="model.timeSeriesConfig"
        :disabled="isDisabled" />
      <time-series-timer-input
        v-else-if="isTimerDataPointConfig(model.timeSeriesConfig)"
        v-model="timerSelection"
        :config="model.timeSeriesConfig"
        :timer="timer"
        :startable="isTimerStartable"
        :disabled="isDisabled"
        @start-timer="startTimer"
        @stop-timer="stopTimer" />
    </template>
  </calendar-plan-item>
</template>

<style></style>
