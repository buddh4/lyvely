<script lang="ts" setup>
import { TimerDataPointValueModel, ITimerDataPointSettings } from '@lyvely/time-series-interface';
import { TimerModel } from '@lyvely/timers-interface';
import TimerState from '@/calendar/components/TimerState.vue';
import { computed } from 'vue';
import { useCalendarPlanStore } from '@/calendar-plan';

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

const updateSelection = (ms: number) => {
  const timer = props.modelValue.timer;
  timer.overwrite(ms);
  emit('update:modelValue', new TimerDataPointValueModel({ timer, ms }));
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
