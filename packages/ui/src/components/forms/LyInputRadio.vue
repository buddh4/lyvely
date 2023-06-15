<script lang="ts" setup>
import { useBaseInputSetup } from './BaseInput';
import { onMounted, ref } from 'vue';
import { t } from '@/i18n';

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
  translate?: boolean;
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
  translate: true,
});

const emit = defineEmits(['change', 'update:modelValue']);

const input = ref<HTMLInputElement>();
const { inputValue, onChange, showHelpText, label, inputClass } = useBaseInputSetup(props, emit);

onMounted(() => {
  if (props.autofocus) setTimeout(() => input.value?.focus());
});
</script>

<template>
  <div :class="wrapperClass">
    <div class="flex">
      <label class="inline-flex items-center">
        <input
          :id="id"
          ref="input"
          v-model="inputValue"
          :aria-describedby="ariaDescribedby"
          type="radio"
          :disabled="disabled"
          :value="value"
          :class="inputClass"
          :readonly="readonly"
          @change="onChange" />
        <span v-if="label" class="label ml-2">{{ translate ? t(label) : label }}</span>
      </label>
    </div>
    <span v-if="showHelpText && helpText" class="text-sm text-dimmed">
      {{ t(helpText) }}
    </span>
  </div>
</template>

<style scoped></style>
