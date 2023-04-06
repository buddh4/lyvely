<script lang="ts" setup>
import { HabitModel, NumberDataPointModel } from '@lyvely/common';
import { computed, onMounted, ref } from 'vue';
import CalendarPlanItem from '@/modules/calendar-plan/components/CalendarPlanItem.vue';
import { useHabitCalendarPlanStore } from '@/modules/habits/stores/habit-calendar-plan.store';
import { useDebounceFn } from '@vueuse/core';
import ContentDropdown from '@/modules/content/components/ContentDropdown.vue';
import { useCalendarPlanPlanItem } from '@/modules/calendar-plan/composables/calendar-plan-item.composable';
import CalendarPlanNumberInput from '@/modules/calendar-plan/components/CalendarPlanNumberInput.vue';

export interface IProps {
  model: HabitModel;
}

const props = defineProps<IProps>();
const initialized = ref(false);
const habitStore = useHabitCalendarPlanStore();
const { selectTag } = habitStore;

const { isDisabled, moveUp, moveDown } = useCalendarPlanPlanItem(props.model, habitStore);

const { getDataPoint } = habitStore;

const dataPoint = computed(() => getDataPoint(props.model) as NumberDataPointModel);

onMounted(async () => {
  await getDataPoint(props.model);
  initialized.value = true;
});

const selection = computed({
  get: () => dataPoint.value.value,
  set: (selection: number) => {
    const oldValue = dataPoint.value.value;
    // Visually update due to debounce delay
    dataPoint.value.value = selection;
    updateSelection(selection, oldValue);
  },
});

const updateSelection = useDebounceFn((selection: number, oldValue?: number) => {
  habitStore.updateDataPoint(dataPoint.value, selection, oldValue);
}, 500);

async function startTimer() {
  if (!dataPoint.value.timer?.isStarted()) {
    await useHabitCalendarPlanStore().startTimer(props.model);
  }
}

async function stopTimer() {
  if (dataPoint.value.timer?.isStarted()) {
    await useHabitCalendarPlanStore().stopTimer(props.model);
  }
}
const timer = computed(() => dataPoint.value.timer!);
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
