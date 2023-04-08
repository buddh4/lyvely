<script lang="ts" setup>
import { TimerModel, TimerDataPointValueModel, ITimerDataPointSettings } from '@lyvely/common';
import TimerState from '@/modules/calendar/components/TimerState.vue';
import { computed } from 'vue';
import { useCalendarPlanStore } from '@/modules/calendar-plan';

interface IProps {
  modelValue: TimerDataPointValueModel;
  config: ITimerDataPointSettings;
  disabled?: boolean;
  timer: TimerModel;
}

const props = withDefaults(defineProps<IProps>(), {
  disabled: false,
});

const emit = defineEmits(['update:modelValue', 'startTimer', 'stopTimer']);

const updateSelection = (value: number) => {
  emit(
    'update:modelValue',
    new TimerDataPointValueModel({
      timer: props.modelValue.timer,
      ms: value,
    }),
  );
};

const isPresentInterval = computed(() =>
  useCalendarPlanStore().isPresentInterval(props.config.interval),
);
</script>

<template>
  <timer-state
    :key="modelValue.ms"
    :model="timer"
    :min="config.min"
    :max="config.max"
    :optimal="config.optimal"
    :startable="isPresentInterval"
    @start="$emit('startTimer')"
    @stop="$emit('stopTimer')"
    @update="updateSelection" />
</template>

<style></style>
