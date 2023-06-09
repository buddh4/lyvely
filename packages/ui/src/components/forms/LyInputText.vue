<script lang="ts" setup>
import { baseInputDefaults, IBaseInputProps } from './BaseInput';
import { computed, onMounted, Ref, ref } from 'vue';
import { useFloatingInputSetup } from './FloatingInput';
import LyFloatingInputLayout from './LyFloatingInputLayout.vue';
import { t } from '@/i18n';

export type ITextInputType = 'text' | 'password';

export interface IProps extends IBaseInputProps {
  type?: ITextInputType;
  passwordToggle?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  ...baseInputDefaults,
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
  this.$emit('toggleType', internalType.value);
}

function change(evt: any) {
  this.$emit('change', evt);
}

const { inputId, inputError, inputValue, autoCompleteValue, onChange, onFocusOut } =
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
