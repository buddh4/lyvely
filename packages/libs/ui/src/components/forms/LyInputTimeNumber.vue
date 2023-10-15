<script lang="ts" setup>
import { useFloatingInputSetup } from './FloatingInput';
import { HTMLAttributes, computed, ref, onMounted } from 'vue';
import LyFloatingInputLayout from './LyFloatingInputLayout.vue';
import { msToTime, timeToMs, padTime } from '@lyvely/dates';
import { Translatable } from '@/i18n';

export interface IProps {
  id?: string;
  label?: Translatable;
  helpText?: Translatable;
  name?: string;
  modelValue?: any;
  value?: string;
  property?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  inputClass?: HTMLAttributes['class'];
  inputStyle?: HTMLAttributes['style'];
  wrapperClass?: HTMLAttributes['class'];
  autofocus?: boolean;
  autocomplete?: boolean | string;
  ariaDescribedby?: string;
  error?: Translatable;
  loading?: boolean;
  autoValidation?: boolean;
  steps?: number;
  min?: number;
  max?: number;
}

const props = withDefaults(defineProps<IProps>(), {
  id: undefined,
  label: undefined,
  modelValue: undefined,
  helpText: undefined,
  value: undefined,
  property: undefined,
  name: undefined,
  disabled: false,
  readonly: false,
  required: false,
  autocomplete: false,
  autofocus: false,
  autoValidation: true,
  loading: false,
  ariaDescribedby: undefined,
  inputClass: undefined,
  inputStyle: undefined,
  wrapperClass: undefined,
  error: undefined,
  steps: 1,
  min: undefined,
  max: undefined,
});

type TimerInterval = 'hours' | 'minutes' | 'seconds';

const emit = defineEmits(['change', 'update:modelValue']);
const input = ref<HTMLInputElement>();

const baseInput = useFloatingInputSetup<number>(props, emit);
const { hasFocus, editable, inputId, inputError } = baseInput;

const baseInputValue = baseInput.inputValue;
const inputValue = computed({
  get: () => {
    let allowed = getAllowedVal(baseInputValue.value);
    if (baseInputValue.value !== allowed) {
      emit('update:modelValue', allowed);
    }
    return baseInputValue.value;
  },
  set: (val: number) => {
    if (!editable) return;

    val = val || 0;
    val = parseInt(val + '');

    emit('change', val);
    baseInputValue.value = hasFocus.value ? val : getAllowedVal(val);
  },
});

function getAllowedVal(val: number): number {
  if (props.min !== undefined) {
    val = Math.max(props.min, val);
  }

  if (props.max !== undefined) {
    val = Math.min(props.max, val);
  }
  return val;
}

const time = ref(msToTime(inputValue.value));

const hourValue = computed({
  get: () => {
    return padTime(msToTime(inputValue.value).hours);
  },
  set: (val: string) => {
    val = val.replace(/\D/g, '');
    if (val.startsWith(time.value.hours + '')) {
      val = val.charAt(val.length - 1);
    }
    time.value.hours = Math.min(Math.max(0, parseInt(val, 10)), 24);
    inputValue.value = 1;
    inputValue.value = timeToMs(time.value);
  },
});

const minuteValue = computed({
  get: () => {
    return padTime(msToTime(inputValue.value).minutes);
  },
  set: (val: string) => {
    val = val.replace(/\D/g, '');
    if (val.startsWith(time.value.minutes + '')) {
      val = val.charAt(val.length - 1);
    }
    time.value.minutes = Math.min(Math.max(0, parseInt(val, 10)), 59);
    inputValue.value = 1;
    inputValue.value = timeToMs(time.value);
  },
});

const secondValue = computed({
  get: () => {
    return padTime(msToTime(inputValue.value).seconds);
  },
  set: (val: string) => {
    val = val.replace(/\D/g, '');
    if (val.startsWith(time.value.seconds + '')) {
      val = val.charAt(val.length - 1);
    }
    time.value.seconds = Math.min(Math.max(0, parseInt(val, 10)), 59);
    inputValue.value = 1;
    inputValue.value = timeToMs(time.value);
  },
});

function increment(interval: TimerInterval, steps?: number) {
  const timerValue = getTimerValueByInterval(interval);
  steps = steps ?? getStepsByInterval(interval);
  const newValue = parseInt(timerValue.value) + steps;
  if (newValue > getMaxByInterval(interval) && getNextIntervalByInterval(interval)) {
    timerValue.value = padTime(0);
  } else {
    timerValue.value = padTime(newValue);
  }
}

function decrement(interval: TimerInterval, steps?: number) {
  const timerValue = getTimerValueByInterval(interval);
  steps = steps ?? getStepsByInterval(interval);
  const newValue = parseInt(timerValue.value) - steps;
  if (newValue < 0) {
    timerValue.value = padTime(getMaxByInterval(interval) + 1 - steps);
  } else {
    timerValue.value = padTime(newValue);
  }
}

function onFocus(evt: FocusEvent) {
  const target = evt.target as HTMLInputElement;
  target.select();
}

function getTimerValueByInterval(interval: TimerInterval) {
  return interval === 'hours' ? hourValue : interval === 'minutes' ? minuteValue : secondValue;
}

function getStepsByInterval(interval: TimerInterval) {
  return interval === 'seconds' ? 5 : interval === 'minutes' ? 5 : 1;
}

function getNextIntervalByInterval(interval: TimerInterval) {
  return interval === 'seconds' ? 'minutes' : interval === 'minutes' ? 'hours' : null;
}

function getMaxByInterval(interval: TimerInterval) {
  return interval === 'hours' ? 24 : 59;
}

const root = ref<HTMLElement>();
function setFocus(interval: TimerInterval) {
  root.value?.querySelector<HTMLElement>(`[data-timer-${interval}-input]`)?.focus();
}

onMounted(() => {
  if (props.autofocus) setTimeout(() => input.value?.focus());
});
</script>

<template>
  <ly-floating-input-layout
    :wrapper-class="wrapperClass"
    :input-id="inputId"
    :label="label"
    :required="required"
    :help-text="helpText"
    :input-error="inputError">
    <div ref="root" data-timer-input class="floating-input h-auto border border-divide">
      <div class="flex justify-center items-center gap-0.5 md:gap-2">
        <div class="flex flex-col">
          <ly-button @click="increment('hours')"><ly-icon name="caret-up"></ly-icon></ly-button>
          <input
            v-model="hourValue"
            data-timer-hours-input
            inputmode="numeric"
            :class="`w-10 bg-highlight border border-divide rounded px-2.5 py-0.5 text-sm ${inputClass}`"
            :style="inputStyle"
            @focus="onFocus"
            @keyup.up="increment('hours')"
            @keyup.down="decrement('hours')"
            @keyup.left="setFocus('seconds')"
            @keyup.right="setFocus('minutes')" />
          <ly-button @click="decrement('hours')"><ly-icon name="caret-down"></ly-icon></ly-button>
        </div>
        <span class="hidden md:block">:</span>
        <div class="flex flex-col">
          <ly-button @click="increment('minutes')"><ly-icon name="caret-up"></ly-icon></ly-button>
          <input
            v-model="minuteValue"
            data-timer-minutes-input
            inputmode="numeric"
            :class="`w-10 bg-highlight border border-divide rounded px-2.5 py-0.5 text-sm ${inputClass}`"
            :style="inputStyle"
            @focus="onFocus"
            @keyup.up="increment('minutes')"
            @keyup.down="decrement('minutes')"
            @keyup.left="setFocus('hours')"
            @keyup.right="setFocus('seconds')" />
          <ly-button @click="decrement('minutes')"><ly-icon name="caret-down"></ly-icon></ly-button>
        </div>
        <span class="hidden md:block">:</span>
        <div class="flex flex-col">
          <ly-button @click="increment('seconds')"><ly-icon name="caret-up"></ly-icon></ly-button>
          <input
            v-model="secondValue"
            data-timer-seconds-input
            inputmode="numeric"
            :class="`w-10 bg-highlight border border-divide rounded px-2.5 py-0.5 text-sm ${inputClass}`"
            :style="inputStyle"
            @focus="onFocus"
            @keyup.up="increment('seconds')"
            @keyup.down="decrement('seconds')"
            @keyup.left="setFocus('minutes')"
            @keyup.right="setFocus('hours')" />
          <ly-button @click="decrement('seconds')"><ly-icon name="caret-down"></ly-icon></ly-button>
        </div>
      </div>
    </div>
  </ly-floating-input-layout>
</template>

<style scoped></style>
