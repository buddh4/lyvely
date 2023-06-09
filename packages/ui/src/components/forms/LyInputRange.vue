<template>
  <section :class="wrapperClass">
    <label v-if="label" :for="id" class="form-label">{{ t(label) }}</label>
    <input
      :id="id"
      ref="input"
      v-model="inputValue"
      :disabled="disabled"
      :aria-describedby="ariaDescribedby"
      :step="step"
      :readonly="readonly"
      :class="inputClass"
      :style="inputStyle"
      :min="min"
      :max="max"
      type="range"
      @change="$emit('change')" />
  </section>
</template>

<script lang="ts">
import { IBaseInputProps, useBaseInputProps, useBaseInputSetup } from './BaseInput';
import { computed, SetupContext } from 'vue';
import { useHelpText } from './help-text.util';

export interface IProps extends IBaseInputProps {
  min?: number;
  max?: number;
  step?: number;
  width?: string;
}

export default {
  props: {
    ...useBaseInputProps(),
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    step: { type: Number, default: 1 },
    width: { type: String, default: '' },
  },
  emits: ['change', 'update:modelValue'],
  setup(props: IProps, context: SetupContext) {
    const baseInput = useBaseInputSetup<number>(props, context);

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
      if (typeof props.min !== 'undefined') {
        val = Math.max(props.min, val);
      }

      if (typeof props.max !== 'undefined') {
        val = Math.min(props.max, val);
      }

      return val;
    }

    function inputStyle() {
      if (!props.width) {
        return {};
      }
      return { width: props.width };
    }

    return {
      ...baseInput,
      ...useHelpText(props.helpText),
      inputStyle,
    };
  },
  mounted() {
    if (this.autofocus) (this.$refs.input as HTMLInputElement).focus();
  },
};
</script>

<style scoped></style>
