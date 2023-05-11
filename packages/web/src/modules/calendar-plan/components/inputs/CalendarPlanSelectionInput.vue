<script lang="ts" setup>
import {
  DataPointInputType,
  ISelectionDataPointSettings,
  ISelectionDataPointValue,
} from '@lyvely/common';
import { computed } from 'vue';
import LyInputCheckbox from '@/modules/ui/components/form/CheckboxInput.vue';
import SelectInput from '@/modules/ui/components/form/SelectInput.vue';
import LyInputSelect from '@/modules/ui/components/form/SelectInput.vue';
import LyInputRadio from '@/modules/ui/components/form/RadioInput.vue';

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
      <ly-input-checkbox v-model="selection" :label="option" :value="option" :translate="false" />
    </div>
  </div>
  <div
    v-else-if="config.inputType === DataPointInputType.Dropdown"
    class="flex w-full items-center gap-2">
    <ly-input-select
      v-model="singleValueSelection"
      class="calendar-plan-dropdown"
      :options="dropDownOptions" />
  </div>
  <div
    v-for="option in config.options"
    v-else-if="config.inputType === DataPointInputType.Radio"
    :key="option">
    <ly-input-radio
      v-model="singleValueSelection"
      :label="option"
      :value="option"
      :translate="false" />
  </div>
</template>

<style scoped>
.calendar-plan-dropdown {
  min-width: 33.333333%;
}
</style>
