<template>
  <floating-input-layout
    :wrapper-class="wrapperClass"
    :input-id="inputId"
    :label="label"
    :required="required"
    :help-text="helpText"
    :input-error="inputError">
    <select
      :id="inputId"
      ref="input"
      v-model="inputValue"
      :aria-describedby="ariaDescribedby"
      :disabled="disabled"
      :class="inputClass">
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ t(option.label) }}
      </option>
    </select>
  </floating-input-layout>
</template>

<script lang="ts">
import { IBaseInputProps, useBaseInputProps } from './BaseInput';
import { useFloatingInputSetup } from './FloatingInput';
import { PropType, SetupContext } from 'vue';
import FloatingInputLayout from './FloatingInputLayout.vue';

export interface IProps extends IBaseInputProps {
  options: Array<{ label: string; value: any }>;
}

export default {
  components: { FloatingInputLayout },
  props: {
    ...useBaseInputProps(),
    options: { type: Array as PropType<Array<{ label: string; value: any }>>, required: true },
  },
  emits: ['change', 'update:modelValue'],
  setup(props: any, context: SetupContext) {
    return useFloatingInputSetup(props, context);
  },
  mounted() {
    if (this.autofocus) (this.$refs.input as HTMLInputElement).focus();
  },
};
</script>

<style scoped></style>
