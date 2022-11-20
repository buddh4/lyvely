<template>
  <floating-input-layout
    :wrapper-class="wrapperClass"
    :input-id="inputId"
    :label="label"
    :required="required"
    :help-text="helpText"
    :input-error="inputError"
  >
    <div class="floating-input h-auto border border-divide">
      <div class="flex justify-center items-center gap-2">
        <div class="flex flex-col">
          <ly-button @click="increment('hours')"><ly-icon name="caret-up"></ly-icon></ly-button>
          <input
            v-model="hourValue"
            inputmode="numeric"
            @focus="onFocus"
            class="w-10 bg-highlight border border-divide rounded px-2.5 py-0.5 text-sm"
          />
          <ly-button @click="decrement('hours')"><ly-icon name="caret-down"></ly-icon></ly-button>
        </div>
        <span>:</span>
        <div class="flex flex-col">
          <ly-button @click="increment('minutes')"><ly-icon name="caret-up"></ly-icon></ly-button>
          <input
            v-model="minuteValue"
            inputmode="numeric"
            @focus="onFocus"
            class="w-10 bg-highlight border border-divide rounded px-2.5 py-0.5 text-sm"
          />
          <ly-button @click="decrement('minutes')"><ly-icon name="caret-down"></ly-icon></ly-button>
        </div>
        <span>:</span>
        <div class="flex flex-col">
          <ly-button @click="increment('seconds')"><ly-icon name="caret-up"></ly-icon></ly-button>
          <input
            v-model="secondValue"
            inputmode="numeric"
            @focus="onFocus"
            class="w-10 bg-highlight border border-divide rounded px-2.5 py-0.5 text-sm"
          />
          <ly-button @click="decrement('seconds')"><ly-icon name="caret-down"></ly-icon></ly-button>
        </div>
      </div>
    </div>
  </floating-input-layout>
</template>

<script lang="ts">
import { IBaseInputProps, useBaseInputProps } from '@/modules/ui/components/form/BaseInput';
import { useFloatingInputSetup } from '@/modules/ui/components/form/FloatingInput';
import { computed, SetupContext, ref } from 'vue';
import FloatingInputLayout from '@/modules/ui/components/form/FloatingInputLayout.vue';
import { msToTime, timeToMs, padTime } from '@lyvely/common';

export interface IProps extends IBaseInputProps {
  steps?: number;
  slider?: boolean;
  min?: number;
  max?: number;
}

type TimerInterval = 'hours' | 'minutes' | 'seconds';

export default {
  components: { FloatingInputLayout },
  props: {
    ...useBaseInputProps(),
    steps: { type: Number, default: 1 },
    slider: { type: Boolean, default: true },
    min: { type: Number, default: undefined },
    max: { type: Number, default: undefined },
  },
  emits: ['change', 'update:modelValue'],
  setup(props: IProps, context: SetupContext) {
    const baseInput = useFloatingInputSetup<number>(props, context);

    const baseInputValue = baseInput.inputValue;
    baseInput.inputValue = computed({
      get: () => {
        let allowed = getAllowedVal(baseInputValue.value);
        if (baseInputValue.value !== allowed) {
          context.emit('update:modelValue', allowed);
        }
        return baseInputValue.value;
      },
      set: (val: number) => {
        if (!baseInput.editable) return;

        val = val || 0;
        val = parseInt(val + '');

        context.emit('change', val);
        baseInputValue.value = baseInput.hasFocus.value ? val : getAllowedVal(val);
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

    const time = ref(msToTime(baseInput.inputValue.value));

    const hourValue = computed({
      get: () => {
        return padTime(msToTime(baseInput.inputValue.value).hours);
      },
      set: (val: string) => {
        val = val.replace(/\D/g, '');
        if (val.startsWith(time.value.hours + '')) {
          val = val.charAt(val.length - 1);
        }
        time.value.hours = Math.min(Math.max(0, parseInt(val, 10)), 24);
        baseInput.inputValue.value = 1;
        baseInput.inputValue.value = timeToMs(time.value);
      },
    });

    const minuteValue = computed({
      get: () => {
        return padTime(msToTime(baseInput.inputValue.value).minutes);
      },
      set: (val: string) => {
        val = val.replace(/\D/g, '');
        if (val.startsWith(time.value.minutes + '')) {
          val = val.charAt(val.length - 1);
        }
        time.value.minutes = Math.min(Math.max(0, parseInt(val, 10)), 59);
        baseInput.inputValue.value = 1;
        baseInput.inputValue.value = timeToMs(time.value);
      },
    });

    const secondValue = computed({
      get: () => {
        return padTime(msToTime(baseInput.inputValue.value).seconds);
      },
      set: (val: string) => {
        val = val.replace(/\D/g, '');
        if (val.startsWith(time.value.seconds + '')) {
          val = val.charAt(val.length - 1);
        }
        time.value.seconds = Math.min(Math.max(0, parseInt(val, 10)), 59);
        baseInput.inputValue.value = 1;
        baseInput.inputValue.value = timeToMs(time.value);
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
      if (newValue < 0 && getPrevIntervalByInterval(interval)) {
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
      return interval === 'seconds' ? 10 : interval === 'minutes' ? 5 : 1;
    }

    function getNextIntervalByInterval(interval: TimerInterval) {
      return interval === 'seconds' ? 'minutes' : interval === 'minutes' ? 'hours' : null;
    }

    function getPrevIntervalByInterval(interval: TimerInterval) {
      return interval === 'hours' ? 'minutes' : interval === 'minutes' ? 'seconds' : null;
    }

    function getMaxByInterval(interval: TimerInterval) {
      return interval === 'hours' ? 24 : 59;
    }

    const buttonClass =
      'w-5 h-5 mr-2 bg-main border border-divide rounded-full flex justify-center items-center text-sm p0';

    return {
      ...baseInput,
      increment,
      decrement,
      onFocus,
      hourValue,
      minuteValue,
      secondValue,
      buttonClass,
    };
  },
  mounted() {
    if (this.autofocus) this.$refs.input.focus();
  },
};
</script>

<style scoped></style>
