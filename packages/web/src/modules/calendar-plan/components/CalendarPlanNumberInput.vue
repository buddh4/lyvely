<script lang="ts" setup>
import {
  DataPointInputType,
  INumberDataPointConfig,
  TimerModel,
  useDataPointStrategyFacade,
} from '@lyvely/common';
import TimerState from '@/modules/calendar/components/TimerState.vue';
import { computed } from 'vue';
import { useCalendarPlanStore } from '@/modules/calendar-plan';
import ItemCheckboxList from '@/modules/activities/components/ItemCheckboxList.vue';

interface IProps {
  modelValue: number;
  config: INumberDataPointConfig;
  disabled?: boolean;
  timer?: TimerModel;
}

const props = withDefaults(defineProps<IProps>(), {
  disabled: false,
  timer: undefined,
});

const emit = defineEmits(['update:modelValue', 'startTimer', 'stopTimer']);

const selection = computed({
  get: () => props.modelValue,
  set: (selection: number) => emit('update:modelValue', selection),
});

const updateSelection = (value: number) => {
  selection.value = value;
};

const inputColorClass = computed(() => {
  if (props.config.min && selection.value <= props.config.min) return 'warning';
  if (props.config.optimal && selection.value >= props.config.optimal) return 'success';
  if (selection.value) return 'success';
  return '';
});

const inputBorderColorClass = computed(() => {
  const color = inputColorClass.value;
  return color.length ? `border-${color}` : color;
});

const isPresentInterval = computed(() =>
  useCalendarPlanStore().isPresentInterval(props.config.interval),
);
</script>

<template>
  <item-checkbox-list
    v-if="config.inputType === DataPointInputType.Checkbox"
    v-model:selection="selection"
    :min="config.min"
    :max="config.max"
    :optimal="config.optimal"
    :disabled="disabled" />
  <ly-input-number
    v-else-if="config.inputType === DataPointInputType.Spinner"
    v-model="selection"
    :input-class="['calendar-plan-spinner-input text-sm bg-main', inputBorderColorClass]"
    :min="0"
    :max="config.max"
    :disabled="disabled" />
  <div v-else-if="config.inputType === DataPointInputType.Range" class="flex items-center gap-2">
    <span class="text-sm">{{ selection }}</span>
    <ly-input-range
      v-model="selection"
      :input-class="['calendar-plan-range-input', inputColorClass]"
      :min="0"
      :max="config.max"
      :disabled="disabled" />
  </div>
  <timer-state
    v-else-if="config.inputType === DataPointInputType.Time"
    :key="timer.calculateTotalSpan()"
    :model="timer"
    :min="config.min"
    :max="config.max"
    :optimal="config.optimal"
    :startable="isPresentInterval"
    @start="$emit('startTimer')"
    @stop="$emit('stopTimer')"
    @update="updateSelection" />
</template>

<style>
.calendar-plan-spinner-input {
  max-width: 130px;
  float: right;
  clear: both;
}

.calendar-plan-range-input {
  max-width: 130px;
  direction: rtl;
  float: right;
  clear: both;
}
</style>
