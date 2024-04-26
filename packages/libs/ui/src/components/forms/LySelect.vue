<script lang="ts" setup>
import { useFloatingInputSetup } from './FloatingInput';
import { t, Translatable } from '@/i18n';
import { computed, HTMLAttributes, onMounted, ref } from 'vue';
import LyFloatingInputLayout from './LyFloatingInputLayout.vue';
import { type ISelectOption, ISelectOptions } from '@/interfaces';

export interface IProps {
  id?: string;
  label?: Translatable;
  type?: 'text' | 'number';
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
  options: ISelectOptions;
}

const props = withDefaults(defineProps<IProps>(), {
  id: undefined,
  label: undefined,
  type: 'text',
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
});

const emit = defineEmits(['change', 'update:modelValue']);
const input = ref<HTMLInputElement>();

const { inputId, dataId, inputClass, inputError, inputValue, label, onChange, onFocusOut } =
  useFloatingInputSetup(props, emit);

const groups = computed<Map<string, { id: string; label: string; options: ISelectOption[] }>>(() =>
  props.options.reduce((optGroups, option) => {
    if (!option.group) return optGroups;
    let optGroup = optGroups.get(option.group.id);
    if (!optGroup) {
      optGroup = { ...option.group, options: [] };
      optGroups.set(option.group.id, optGroup);
    }
    optGroup.options.push(option);
    return optGroups;
  }, new Map<string, { id: string; label: string; options: ISelectOption[] }>()),
);

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
    <select
      v-if="type === 'number'"
      :id="inputId"
      :data-id="dataId"
      ref="input"
      v-model.number="inputValue"
      :aria-describedby="ariaDescribedby"
      :disabled="disabled"
      :class="[inputClass, 'pr-5']"
      :style="inputStyle"
      @change="onChange"
      @focusout="onFocusOut">
      <option v-if="placeholder" value="" disabled selected hidden>{{ t(placeholder) }}</option>
      <optgroup v-for="[groupId, group] in groups" :key="groupId" :label="t(group.label)">
        <option v-for="option in group.options" :key="option.value" :value="option.value">
          {{ t(option.label) }}
        </option>
      </optgroup>
      <template v-for="option in options">
        <option v-if="!option.group" :key="option.value" :value="option.value">
          {{ t(option.label) }}
        </option>
      </template>
    </select>
    <select
      v-else
      :id="inputId"
      :data-id="dataId"
      ref="input"
      v-model="inputValue"
      :aria-describedby="ariaDescribedby"
      :disabled="disabled"
      :class="[inputClass, 'pr-5']"
      :style="inputStyle"
      @change="onChange"
      @focusout="onFocusOut">
      <option v-if="placeholder" value="" disabled selected hidden>{{ t(placeholder) }}</option>
      <optgroup v-for="[groupId, group] in groups" :key="groupId" :label="t(group.label)">
        <option v-for="option in group.options" :key="option.value" :value="option.value">
          {{ t(option.label) }}
        </option>
      </optgroup>
      <template v-for="option in options">
        <option v-if="!option.group" :key="option.value" :value="option.value">
          {{ t(option.label) }}
        </option>
      </template>
    </select>
  </ly-floating-input-layout>
</template>

<style scoped></style>
