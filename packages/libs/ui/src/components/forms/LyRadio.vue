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
const { inputValue, inputId, dataId, onChange, onFocusOut, showHelpText, label, inputClass } =
  useBaseInputSetup(props, emit);

const radioId = `${inputId}-${props.value}`;
const radioDataId = `${dataId}-${props.value}`;

onMounted(() => {
  if (props.autofocus) setTimeout(() => input.value?.focus());
});
</script>

<template>
  <div :class="wrapperClass">
    <div class="flex">
      <label :for="inputId" class="inline-flex items-center">
        <input
          :id="radioId"
          :data-id="radioDataId"
          :name="inputId"
          ref="input"
          v-model="inputValue"
          :aria-describedby="ariaDescribedby"
          type="radio"
          :disabled="disabled"
          :value="value"
          :class="inputClass"
          :style="inputStyle"
          :readonly="readonly"
          @change="onChange"
          @focusout="onFocusOut" />
        <span v-if="label" class="label ml-2 text-sm">{{ t(label) }}</span>
      </label>
    </div>
    <span v-if="showHelpText && helpText" class="text-sm text-dimmed">
      {{ t(helpText) }}
    </span>
  </div>
</template>

<style>
[type='radio'].primary {
  --tw-ring-offset-shadow: none;
  border-color: var(--color-primary);
}

[type='radio'].primary:checked {
  background-color: var(--color-primary);
}

[type='radio'].secondary {
  --tw-ring-offset-shadow: none;
  border-color: var(--color-secondary);
}

[type='radio'].secondary:checked {
  background-color: var(--color-secondary);
}

[type='radio'].success {
  --tw-ring-offset-shadow: none;
  border-color: var(--color-success);
}

[type='radio'].success:checked {
  background-color: var(--color-success);
  opacity: 1;
}

[type='radio'].info {
  --tw-ring-offset-shadow: none;
  border-color: var(--color-info);
}

[type='radio'].info:checked {
  background-color: var(--color-info);
}

[type='radio'].warning {
  --tw-ring-offset-shadow: none;
  border-color: var(--color-warning);
}

[type='radio'].warning:checked {
  background-color: var(--color-warning);
}

[type='radio'].danger {
  --tw-ring-offset-shadow: none;
  border-color: var(--color-danger);
}

[type='radio'].danger:checked {
  background-color: var(--color-danger);
}
</style>
