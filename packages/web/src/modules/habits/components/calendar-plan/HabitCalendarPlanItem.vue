<script lang="ts" setup>
import { HabitModel, isNumberDataPointConfig, isTimerDataPointConfig } from '@lyvely/common';
import { onMounted, ref } from 'vue';
import CalendarPlanItem from '@/modules/calendar-plan/components/CalendarPlanItem.vue';
import { useHabitCalendarPlanStore } from '@/modules/habits/stores/habit-calendar-plan.store';
import ContentDropdown from '@/modules/content/components/ContentDropdown.vue';
import { useCalendarPlanPlanItem } from '@/modules/calendar-plan/composables/calendar-plan-item.composable';
import CalendarPlanNumberInput from '@/modules/calendar-plan/components/inputs/CalendarPlanNumberInput.vue';
import CalendarPlanTimerInput from '@/modules/calendar-plan/components/inputs/CalendarPlanTimerInput.vue';
import { useUpdateHabit } from '@/modules/habits/composables/update-habit.composable';

export interface IProps {
  model: HabitModel;
}

const props = defineProps<IProps>();
const initialized = ref(false);
const habitStore = useHabitCalendarPlanStore();
const { selectTag, getDataPoint } = habitStore;
const { isDisabled, moveUp, moveDown } = useCalendarPlanPlanItem(props.model, habitStore);
const { selection, startTimer, stopTimer, timer } = useUpdateHabit(props.model);

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
      <calendar-plan-number-input
        v-if="isNumberDataPointConfig(model.timeSeriesConfig)"
        v-model="selection"
        :config="model.timeSeriesConfig"
        :disabled="isDisabled" />
      <calendar-plan-timer-input
        v-else-if="isTimerDataPointConfig(model.timeSeriesConfig)"
        v-model="timerSelection"
        :config="model.timeSeriesConfig"
        :timer="timer"
        :disabled="isDisabled"
        @start-timer="startTimer"
        @stop-timer="stopTimer" />
    </template>
  </calendar-plan-item>
</template>

<style></style>
