<script lang="ts" setup>
import { computed, onMounted, Ref, ref } from 'vue';
import { useFloatingInputSetup } from './FloatingInput';
import LyFloatingInputLayout from './LyFloatingInputLayout.vue';
import { t } from '@/i18n';

export type ITextInputType = 'text' | 'password';

export interface IProps {
  id?: string;
  label?: string;
  helpText?: string;
  name?: string;
  modelValue?: any;
  value?: string;
  property?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  inputClass?: any;
  wrapperClass?: string;
  autofocus?: boolean;
  autocomplete?: boolean | string;
  ariaDescribedby?: string;
  error?: string;
  loading?: boolean;
  autoValidation?: boolean;
  type?: ITextInputType;
  passwordToggle?: boolean;
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
  wrapperClass: undefined,
  error: undefined,
  type: 'text',
  passwordToggle: true,
});

const emit = defineEmits(['change', 'update:modelValue', 'toggleType']);

const internalType = ref(props.type) as Ref<ITextInputType>;
const input = ref<HTMLInputElement>();

const togglePasswordIcon = computed(() => {
  return internalType.value === 'password' ? 'eye' : 'eye-slash';
});

const togglePasswordAriaLabel = computed(() => {
  return internalType.value === 'password' ? 'common.show_password' : 'common.hide_password';
});

const isPassword = computed(() => props.type === 'password');

function togglePassword() {
  internalType.value = internalType.value === 'password' ? 'text' : 'password';
  emit('toggleType', internalType.value);
}

const {
  inputId,
  inputClass,
  inputError,
  inputValue,
  autoCompleteValue,
  onChange,
  onFocusOut,
  label,
} = useFloatingInputSetup(props, emit);

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
    <template #label>
      <slot name="label"></slot>
    </template>

    <input
      :id="inputId"
      ref="input"
      v-model="inputValue"
      :name="name"
      :disabled="disabled"
      :placeholder="placeholder"
      :aria-invalid="!!inputError?.length"
      :aria-errormessage="inputError"
      :aria-describedby="ariaDescribedby"
      :readonly="readonly"
      :autocomplete="autoCompleteValue"
      :type="internalType"
      :class="inputClass"
      @change="onChange"
      @focusout="onFocusOut" />

    <div
      v-if="isPassword && passwordToggle"
      role="button"
      class="absolute flex top-1 right-2 cursor-pointer"
      :aria-label="t(togglePasswordAriaLabel)"
      @click="togglePassword">
      <ly-icon :name="togglePasswordIcon" />
    </div>
  </ly-floating-input-layout>
</template>
