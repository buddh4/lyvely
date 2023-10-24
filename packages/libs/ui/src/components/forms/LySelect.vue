<script lang="ts" setup>
import { useFloatingInputSetup } from './FloatingInput';
import { t, Translatable } from '@/i18n';
import { HTMLAttributes, onMounted, ref } from 'vue';
import LyFloatingInputLayout from './LyFloatingInputLayout.vue';
import { ISelectOptions } from '@/interfaces';

export interface IProps {
  id?: string;
  label?: Translatable;
  helpText?: Translatable;
  name?: string;
  modelValue?: any;
  value?: string;
  property?: string;
  placeholder?: Translatable;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  inputClass?: HTMLAttributes['class'];
  inputStyle?: HTMLAttributes['style'];
  wrapperClass?: HTMLAttributes['class'];
  autofocus?: boolean;
  autocomplete?: boolean | string;
  ariaDescribedby?: string;
  error?: string;
  loading?: boolean;
  autoValidation?: boolean;
  options: ISelectOptions;
}

const props = withDefaults(defineProps<IProps>(), {
  id: undefined,
  label: undefined,
  modelValue: undefined,
  helpText: undefined,
  value: undefined,
  property: undefined,
  placeholder: undefined,
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
});

const emit = defineEmits(['change', 'update:modelValue']);
const input = ref<HTMLInputElement>();

const { inputId, inputClass, inputError, inputValue, label } = useFloatingInputSetup(props, emit);

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
    <select
      :id="inputId"
      ref="input"
      v-model="inputValue"
      :aria-describedby="ariaDescribedby"
      :disabled="disabled"
      :class="inputClass"
      :style="inputStyle">
      <option v-if="placeholder" value="" disabled selected hidden>{{ t(placeholder) }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ t(option.label) }}
      </option>
    </select>
  </ly-floating-input-layout>
</template>

<style scoped></style>
