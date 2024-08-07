<script lang="ts" setup>
import { computed, onMounted, ref, HTMLAttributes, watch } from 'vue';
import { useFloatingInputSetup } from './FloatingInput';
import LyFloatingInputLayout from './LyFloatingInputLayout.vue';
import LyIcon from '@/components/icons/LyIcon.vue';
import { t, Translatable } from '@/i18n';

export type ITextInputType = 'text' | 'password';

export interface IProps {
  id?: string;
  label?: Translatable;
  helpText?: Translatable;
  name?: string;
  trim?: boolean;
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
  type?: ITextInputType;
  hide?: boolean | undefined;
  passwordToggle?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  id: undefined,
  label: undefined,
  modelValue: undefined,
  helpText: undefined,
  trim: true,
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
  type: 'text',
  hide: undefined,
  passwordToggle: true,
});

const emit = defineEmits(['update:modelValue', 'update:hide']);

const input = ref<HTMLInputElement>();

const hiddenState = ref<boolean>(props.hide ?? props.type === 'password');

watch(
  () => props.hide,
  (val?: boolean) => {
    hiddenState.value = !!val;
  }
);

const internalType = computed(() => {
  return hiddenState.value ? 'password' : props.type === 'password' ? 'text' : props.type;
});

const togglePasswordIcon = computed(() => {
  return internalType.value === 'password' ? 'eye' : 'eye-slash';
});

const togglePasswordAriaLabel = computed(() => {
  return internalType.value === 'password' ? 'common.show_password' : 'common.hide_password';
});

function togglePassword() {
  if (typeof props.hide === 'boolean') {
    emit('update:hide', !hiddenState.value);
  } else {
    hiddenState.value = !hiddenState.value;
  }
}

const {
  inputId,
  dataId,
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
    :loading="loading"
    :input-error="inputError">
    <template #label>
      <slot name="label"></slot>
    </template>

    <input
      :id="inputId"
      ref="input"
      v-model="inputValue"
      :data-id="dataId"
      :name="name"
      :disabled="disabled"
      :placeholder="t(placeholder)"
      :aria-invalid="!!t(inputError).length"
      :aria-errormessage="t(inputError)"
      :aria-describedby="ariaDescribedby"
      :readonly="readonly"
      :autocomplete="autoCompleteValue"
      :type="internalType"
      :class="inputClass"
      :style="inputStyle"
      @change="onChange"
      @focusout="onFocusOut" />

    <div
      v-if="passwordToggle && type === 'password'"
      role="button"
      class="absolute right-2 top-1 flex cursor-pointer"
      :aria-label="t(togglePasswordAriaLabel)"
      @click="togglePassword">
      <ly-icon :name="togglePasswordIcon" />
    </div>
  </ly-floating-input-layout>
</template>
