<script lang="ts" setup>
import { useFloatingInputSetup } from './FloatingInput';
import { HTMLAttributes, onMounted, ref } from 'vue';
import LyFloatingInputLayout from './LyFloatingInputLayout.vue';
import { t, Translatable } from '@/i18n';

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
  error?: Translatable;
  loading?: boolean;
  autoValidation?: boolean;
  rows: number;
  maxlength: number;
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
  rows: 3,
  maxlength: undefined,
});

const emit = defineEmits(['update:modelValue']);
const input = ref<HTMLInputElement>();

const { inputId, dataId, inputClass, inputError, inputValue, label, onChange, onFocusOut } =
  useFloatingInputSetup(props, emit);

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
    :loading="loading"
    :input-error="inputError">
    <textarea
      :id="inputId"
      :data-id="dataId"
      ref="input"
      v-model="inputValue"
      :placeholder="t(placeholder)"
      :aria-describedby="ariaDescribedby"
      :rows="rows"
      :disabled="disabled"
      :readonly="readonly"
      :class="inputClass"
      :style="inputStyle"
      :maxlength="maxlength"
      @change="onChange"
      @focusout="onFocusOut">
    </textarea>
  </ly-floating-input-layout>
</template>

<style scoped></style>
