<script lang="ts" setup>
import { useBaseInputSetup } from './BaseInput';
import { HTMLAttributes, computed, onMounted, ref } from 'vue';
import { t, Translatable } from '@/i18n';

export interface IProps {
  id?: string;
  label?: Translatable;
  helpText?: Translatable;
  name?: string;
  modelValue?: any;
  value?: string;
  property?: string;
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
  min: number;
  max: number;
  step?: number;
}

const props = withDefaults(defineProps<IProps>(), {
  id: undefined,
  label: undefined,
  modelValue: undefined,
  helpText: undefined,
  value: undefined,
  property: undefined,
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
  step: 1,
});

const emit = defineEmits(['change', 'update:modelValue']);
const input = ref<HTMLInputElement>();

const baseInput = useBaseInputSetup<number>(props, emit);
const { editable, hasFocus, label, inputClass, showHelpText } = baseInput;

const baseInputValue = baseInput.inputValue;
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
    baseInputValue.value = hasFocus.value ? val : getAllowedVal(val);
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

onMounted(() => {
  if (props.autofocus) setTimeout(() => input.value?.focus());
});
</script>

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
    <span v-if="showHelpText && helpText" class="text-sm text-dimmed">
      {{ t(helpText) }}
    </span>
  </section>
</template>

<style scoped></style>
