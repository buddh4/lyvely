<script lang="ts" setup>
import { useBaseInputSetup } from '@/components/forms/BaseInput';
import { onMounted, ref } from 'vue';
import { useHelpText } from './help-text.util';
import { t, Translatable } from '@/i18n';
import { HTMLAttributes } from 'vue';

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
  error?: Translatable;
  loading?: boolean;
  autoValidation?: boolean;
  checked?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  id: undefined,
  label: undefined,
  modelValue: undefined,
  helpText: undefined,
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
  checked: undefined,
  value: '',
});

const emit = defineEmits(['change', 'update:modelValue']);

const checkbox = ref<HTMLInputElement>();

const { inputValue, helpText, label, inputClass } = useBaseInputSetup<boolean>(props, emit, {
  inputClass: 'border rounded ring-0',
});

const { hasHelpText, helpTextId, translatedHelpText, showHelpText } = useHelpText(helpText.value);

function onChange(evt: any, toggle = false) {
  if (props.readonly || props.disabled) return;
  emit('change', toggle ? !evt.target.checked : evt.target.checked, evt.target.value);
}

function toggle(evt: Event) {
  evt.stopImmediatePropagation();
  evt.stopPropagation();
  evt.preventDefault();

  inputValue.value = !checkbox.value!.checked;
  onChange(evt, true);
}

onMounted(() => {
  if (props.autofocus) setTimeout(() => checkbox.value?.focus());
});
</script>
<template>
  <div :class="['cursor-pointer', wrapperClass]" @keydown.space.prevent.stop="toggle">
    <div class="flex">
      <label :class="['inline-flex items-center', { 'cursor-pointer': !readonly && !disabled }]">
        <input
          ref="checkbox"
          v-model="inputValue"
          :aria-describedby="ariaDescribedby"
          type="checkbox"
          :disabled="disabled"
          :value="value"
          :class="inputClass"
          :style="inputStyle"
          :readonly="readonly"
          @change="onChange" />
        <span v-if="label" class="label ml-2">
          {{ t(label) }}
        </span>
      </label>
      <ly-icon
        v-if="hasHelpText"
        name="info"
        class="text-info-dark ml-1 cursor-pointer select-none"
        @click="showHelpText = !showHelpText" />
    </div>
    <ly-alert
      v-if="hasHelpText"
      v-show="showHelpText"
      :id="helpTextId"
      class="mt-2 text-xs"
      type="info">
      {{ translatedHelpText }}
    </ly-alert>
  </div>
</template>

<style scoped></style>
