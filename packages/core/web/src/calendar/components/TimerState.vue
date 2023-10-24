<script lang="ts" setup>
import { formatTime, msToTime } from '@lyvely/dates';
import { TimerModel } from '@lyvely/timers-interface';
import { computed, ref, watch } from 'vue';

export interface IProps {
  model: TimerModel;
  min?: number;
  optimal?: number;
  max?: number;
  startable?: boolean;
  showTimeOnInit?: boolean;
  autoClose?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  startable: true,
  showTimeOnInit: true,
  autoClose: true,
  min: undefined,
  optimal: undefined,
  max: undefined,
});

const emit = defineEmits(['start', 'stop', 'update']);
const isStarted = computed(() => props.model.isStarted());
const showTimerEdit = ref(false);
const timerEditValue = ref(0);

const timerValue = ref(props.model.calculateTotalSpan());
const formattedTimerValue = computed(() => formatTime(msToTime(timerValue.value)));

let timerInterval: ReturnType<typeof setInterval>;
function syncTimerState(start: boolean) {
  if (timerInterval) clearInterval(timerInterval);
  if (start) {
    timerInterval = setInterval(() => {
      if (props.max && timerValue.value + 1000 >= props.max) {
        timerValue.value = props.max;
        clearInterval(timerInterval);
        emit('stop');
      } else {
        timerValue.value += 1000;
      }
    }, 1000);
  } else {
    timerValue.value = props.model.calculateTotalSpan();
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

function setEditTimer() {
  timerEditValue.value = timerValue.value;
  showTimerEdit.value = true;
}

function submitEditTimer() {
  showTimerEdit.value = false;
  emit('update', timerEditValue.value);
}

watch(isStarted, syncTimerState);
syncTimerState(isStarted.value);
</script>

<template>
  <div class="flex items-center gap-2">
    <a
      v-if="showTimeOnInit || timerValue > 0"
      role="link"
      :class="['text-sm cursor-pointer', textColorClass]"
      @click="setEditTimer"
      >{{ formattedTimerValue }}</a
    >
    <ly-button
      v-if="startable && !model.isStarted()"
      class="w-5 h-5 bg-main border border-divide rounded-full flex justify-center items-center text-sm px-0 py-0"
      @click="emit('start')">
      <ly-icon name="play" class="w-3 text-primary" />
    </ly-button>
    <ly-button
      v-if="model.isStarted()"
      class="w-5 h-5 bg-main border border-divide rounded-full flex justify-center items-center text-sm px-0 py-0"
      @click="emit('stop')">
      <ly-icon name="stop" class="w-3 text-danger" />
    </ly-button>
  </div>
  <ly-modal v-model="showTimerEdit" title="timer.edit.title" @submit="submitEditTimer">
    <ly-time-number-input v-model="timerEditValue" :max="max || undefined" />
  </ly-modal>
</template>

<style scoped></style>
