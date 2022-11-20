<script lang="ts" setup>
import { TimerModel, formatTime, msToTime } from '@lyvely/common';
import { computed, ref, watch } from 'vue';

export interface IProps {
  modelValue: TimerModel;
  min?: number;
  optimal?: number;
  max?: number;
  startable?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  startable: true,
  min: undefined,
  optimal: undefined,
  max: undefined,
});

const emits = defineEmits(['start', 'stop']);
const isStarted = computed(() => props.modelValue.isStarted());

const timerValue = ref(props.modelValue.calculateTotalSpan());
const formattedTimerValue = computed(() => formatTime(msToTime(timerValue.value)));

let timerInterval: ReturnType<typeof setInterval>;
function syncTimerState(start: boolean) {
  if (timerInterval) clearInterval(timerInterval);

  if (start) {
    timerInterval = setInterval(() => {
      timerValue.value += 1000;
    }, 1000);
  }
}

const textColorClass = computed(() => {
  if (props.min && timerValue.value <= props.min) {
    return 'text-warning';
  }

  if (props.optimal && timerValue.value >= props.optimal!) {
    return 'text-success';
  }

  if (timerValue.value) {
    return 'text-info';
  }

  return '';
});

watch(isStarted, syncTimerState);
syncTimerState(isStarted.value);
</script>

<template>
  <div class="flex items-center gap-2">
    <span :class="['text-sm', textColorClass]">{{ formattedTimerValue }}</span>
    <ly-button
      v-if="startable && !modelValue.isStarted()"
      class="w-5 h-5 bg-main border border-main rounded-full flex justify-center items-center text-sm px-0 py-0"
      @click="emits('start')"
    >
      <ly-icon name="play" class="w-3 text-primary" />
    </ly-button>
    <ly-button
      v-if="modelValue.isStarted()"
      class="w-5 h-5 bg-main border border-main rounded-full flex justify-center items-center text-sm px-0 py-0"
      @click="emits('stop')"
    >
      <ly-icon name="stop" class="w-3 text-danger" />
    </ly-button>
  </div>
</template>

<style scoped></style>
