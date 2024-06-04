<script lang="ts" setup>
import { useFloatingInputSetup } from '@/components/forms/FloatingInput';
import { HTMLAttributes, computed, onMounted, ref } from 'vue';
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
  error?: string;
  loading?: boolean;
  autoValidation?: boolean;
  steps?: number;
  slider?: boolean;
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
  steps: 1,
  slider: true,
  min: undefined,
  max: undefined,
});

const emit = defineEmits([
  'change',
  'update:modelValue',
  'increment',
  'decrement',
  'blur',
  'focus',
  'input',
]);
let baseInput = useFloatingInputSetup<number>(props, emit);
const { editable, inputId, dataId, inputError, label, inputClass, onChange, onFocusOut } =
  baseInput;

const baseInputValue = baseInput.inputValue;
const input = ref<HTMLInputElement>();

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
  inputValue.value = getAllowedVal(inputValue.value + props.steps!);
  emit('increment', inputValue.value);
}

function decrement() {
  inputValue.value = getAllowedVal(inputValue.value - props.steps!);
  emit('decrement', inputValue.value);
}

const buttonClass =
  'w-5 h-5 mr-2 bg-main border border-divide rounded-full flex justify-center items-center text-main text-sm px-0 py-0';

const leadingZerosRegex = new RegExp(/^0+[0-9]+/);

function onInput($evt: Event) {
  const target = $evt.target as HTMLInputElement;
  if (leadingZerosRegex.test(`${target.value}`)) {
    target.value = parseInt(target.value) + '';
  }
  emit('input', $evt);
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
    :loading="loading"
    :input-error="inputError">
    <input
      :id="inputId"
      ref="input"
      v-model.number="inputValue"
      :data-id="dataId"
      :placeholder="t(placeholder)"
      :aria-describedby="ariaDescribedby"
      :disabled="disabled"
      :readonly="readonly"
      :class="inputClass"
      :style="inputStyle"
      type="text"
      inputmode="numeric"
      @blur="$emit('blur')"
      @change="onChange"
      @focusout="onFocusOut"
      @input="onInput" />
    <div v-if="slider && editable" class="number-slider">
      <button :class="buttonClass" type="button" @click="increment">+</button>
      <button :class="buttonClass" type="button" @click="decrement">-</button>
    </div>
  </ly-floating-input-layout>
</template>

<style scoped></style>
