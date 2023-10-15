<script lang="ts" setup>
import { useBaseInputSetup } from './BaseInput';
import { HTMLAttributes, onMounted, ref } from 'vue';
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
          :style="inputStyle"
          :readonly="readonly"
          @change="onChange" />
        <span v-if="label" class="label ml-2">{{ t(label) }}</span>
      </label>
    </div>
    <span v-if="showHelpText && helpText" class="text-sm text-dimmed">
      {{ t(helpText) }}
    </span>
  </div>
</template>

<style scoped></style>
