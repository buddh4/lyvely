<script lang="ts" setup>
import {
  DataPointInputType,
  ISelectionDataPointSettings,
  ISelectionDataPointValue,
} from '@lyvely/time-series-interface';
import { computed } from 'vue';
import { LyCheckbox, LySelect, LyRadio } from '@lyvely/ui';

interface IProps {
  modelValue: ISelectionDataPointValue;
  config: ISelectionDataPointSettings;
  disabled?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  disabled: false,
});

const emit = defineEmits(['update:modelValue']);

const selection = computed({
  get: () => props.modelValue.selection,

  set: (selection: Array<string>) => {
    // eslint-disable-next-line vue/no-mutating-props
    props.modelValue.selection = selection;
    emit('update:modelValue', props.modelValue);
  },
});

const singleValueSelection = computed({
  get: () => (props.modelValue.selection.length ? props.modelValue.selection[0] : ''),

  set: (selection: string) => {
    // eslint-disable-next-line vue/no-mutating-props
    props.modelValue.selection = [selection];
    emit('update:modelValue', props.modelValue);
  },
});

const dropDownOptions = computed(() =>
  props.config.options.map((value) => ({ label: value, value })),
);
</script>

<template>
  <div v-if="config.inputType === DataPointInputType.Checkbox" class="flex flex-col gap-2 ml-2">
    <div v-for="option in config.options" :key="option">
      <ly-checkbox v-model="selection" :label="{ plain: option }" :value="option" />
    </div>
  </div>
  <div
    v-else-if="config.inputType === DataPointInputType.Dropdown"
    class="flex w-full items-center gap-2">
    <ly-select
      v-model="singleValueSelection"
      style="min-width: 33.333333%"
      :options="dropDownOptions" />
  </div>
  <div
    v-for="option in config.options"
    v-else-if="config.inputType === DataPointInputType.Radio"
    :key="option">
    <ly-radio v-model="singleValueSelection" :label="{ plain: option }" :value="option" />
  </div>
</template>

<style scoped></style>
