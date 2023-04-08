<script lang="ts" setup>
import { HabitModel, isNumberDataPointConfig, isTimerDataPointConfig } from '@lyvely/common';
import { computed, onMounted, ref } from 'vue';
import CalendarPlanItem from '@/modules/calendar-plan/components/CalendarPlanItem.vue';
import { useHabitCalendarPlanStore } from '@/modules/habits/stores/habit-calendar-plan.store';
import ContentDropdown from '@/modules/content/components/ContentDropdown.vue';
import { useCalendarPlanPlanItem } from '@/modules/calendar-plan/composables/calendar-plan-item.composable';
import CalendarPlanNumberInput from '@/modules/time-series/components/CalendarPlanNumberInput.vue';
import CalendarPlanTimerInput from '@/modules/time-series/components/CalendarPlanTimerInput.vue';

export interface IProps {
  model: HabitModel;
}

const props = defineProps<IProps>();
const initialized = ref(false);
const habitStore = useHabitCalendarPlanStore();
const { selectTag, updateDataPoint } = habitStore;
const { isDisabled, moveUp, moveDown } = useCalendarPlanPlanItem(props.model, habitStore);
const { getDataPoint } = habitStore;
const dataPoint = computed(() => getDataPoint(props.model));

const selection = computed({
  get: () => dataPoint.value.value,
  set: (selection: number) => {
    const oldValue = dataPoint.value.value;
    // Visually update due to debounce delay
    dataPoint.value.value = selection;
    updateDataPoint(dataPoint.value, selection, oldValue);
  },
});

async function startTimer() {
  if (!timer.value) return;
  if (!timer.value.isStarted()) {
    await useHabitCalendarPlanStore().startTimer(props.model);
  }
}

async function stopTimer() {
  if (!timer.value) return;
  if (timer.value.isStarted()) {
    await useHabitCalendarPlanStore().stopTimer(props.model);
  }
}

const timer = computed(() => dataPoint.value.value.timer);

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
      <calendar-plan-number-input
        v-if="isNumberDataPointConfig(model.timeSeriesConfig)"
        v-model="selection"
        :config="model.timeSeriesConfig"
        :disabled="isDisabled" />
      <calendar-plan-timer-input
        v-else-if="isTimerDataPointConfig(model.timeSeriesConfig)"
        v-model="selection"
        :config="model.timeSeriesConfig"
        :timer="timer"
        :disabled="isDisabled"
        @start-timer="startTimer"
        @stop-timer="stopTimer" />
    </template>
  </calendar-plan-item>
</template>

<style></style>
