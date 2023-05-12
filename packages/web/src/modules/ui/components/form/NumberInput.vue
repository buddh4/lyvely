<template>
  <floating-input-layout
    :wrapper-class="wrapperClass"
    :input-id="inputId"
    :label="label"
    :required="required"
    :help-text="helpText"
    :input-error="inputError">
    <input
      :id="inputId"
      ref="input"
      v-model.number="inputValue"
      :placeholder="placeholder"
      :aria-describedby="ariaDescribedby"
      :disabled="disabled"
      :readonly="readonly"
      :class="inputClass"
      type="text"
      inputmode="numeric"
      @blur="$emit('blur')"
      @input="onInput" />
    <div v-if="slider && editable" class="number-slider">
      <ly-button :class="buttonClass" @click="increment">+</ly-button>
      <ly-button :class="buttonClass" @click="decrement">-</ly-button>
    </div>
  </floating-input-layout>
</template>

<script lang="ts">
import { IBaseInputProps, useBaseInputProps } from '@/modules/ui/components/form/BaseInput';
import { useFloatingInputSetup } from '@/modules/ui/components/form/FloatingInput';
import { computed, ref, SetupContext, watch } from 'vue';
import FloatingInputLayout from '@/modules/ui/components/form/FloatingInputLayout.vue';

export interface IProps extends IBaseInputProps {
  steps?: number;
  slider?: boolean;
  min?: number;
  max?: number;
}

export default {
  components: { FloatingInputLayout },
  props: {
    ...useBaseInputProps(),
    steps: { type: Number, default: 1 },
    slider: { type: Boolean, default: true },
    min: { type: Number, default: undefined },
    max: { type: Number, default: undefined },
  },
  emits: ['change', 'update:modelValue', 'increment', 'decrement', 'blur', 'focus', 'input'],
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
        debugger;

        context.emit('change', val);
        //baseInputValue.value = baseInput.hasFocus.value ? val : getAllowedVal(val);
        baseInputValue.value = val;
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

    function increment() {
      baseInput.inputValue.value = getAllowedVal(baseInput.inputValue.value + props.steps!);
      context.emit('increment', baseInput.inputValue.value);
    }

    function decrement() {
      baseInput.inputValue.value = getAllowedVal(baseInput.inputValue.value - props.steps!);
      context.emit('decrement', baseInput.inputValue.value);
    }

    const buttonClass =
      'w-5 h-5 mr-2 bg-main border border-divide rounded-full flex justify-center items-center text-sm px-0 py-0';

    const leadingZerosRegex = new RegExp(/^0+[0-9]+/);

    function onInput($evt: InputEvent) {
      const target = $evt.target as HTMLInputElement;
      if (leadingZerosRegex.test(`${target.value}`)) {
        target.value = parseInt(target.value) + '';
      }
      context.emit('input', $evt);
    }
    return {
      ...baseInput,
      increment,
      decrement,
      buttonClass,
      onInput,
    };
  },
  mounted() {
    if (this.autofocus) this.$refs.input.focus();
  },
};
</script>

<style scoped></style>
