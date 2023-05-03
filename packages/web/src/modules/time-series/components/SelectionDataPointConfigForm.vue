<script lang="ts" setup>
import { DataPointInputType, ISelectionDataPointSettings } from '@lyvely/common';
import { ref } from 'vue';
import { isArray } from 'class-validator';

interface IProps {
  modelValue: Partial<ISelectionDataPointSettings>;
  score: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  score: false,
});

const newOption = ref('');

function addOption() {
  if (!isArray(props.modelValue.options)) {
    // eslint-disable-next-line vue/no-mutating-props
    props.modelValue.options = [];
  }
  if (!props.modelValue.options.includes(newOption.value)) {
    // eslint-disable-next-line vue/no-mutating-props
    props.modelValue.options.push(newOption.value);
  }

  newOption.value = '';
}

function removeOption(option: string) {
  if (!isArray(props.modelValue.options)) return;
  // eslint-disable-next-line vue/no-mutating-props
  props.modelValue.options = props.modelValue.options.filter((o) => o !== option);
}

function setInputType(inputType: DataPointInputType) {
  const modelValue = props.modelValue;
  modelValue.inputType = inputType;
  if (modelValue.inputType === DataPointInputType.Dropdown) {
    modelValue.allowOther = false;
  }
}
</script>

<template>
  <div class="flex flex-col gap-2 border border-divide rounded bg-highlight dark:bg-main p-3">
    <div class="flex gap-2 justify-between items-stretch">
      <ly-button
        class="text-xs secondary w-full"
        :active="modelValue.inputType === DataPointInputType.Checkbox"
        @click="setInputType(DataPointInputType.Checkbox)">
        {{ $t('calendar.plan.input_types.checkbox') }}
      </ly-button>

      <ly-button
        class="text-xs secondary w-full"
        :active="modelValue.inputType === DataPointInputType.Radio"
        @click="setInputType(DataPointInputType.Radio)">
        {{ $t('calendar.plan.input_types.radio') }}
      </ly-button>

      <ly-button
        class="text-xs secondary w-full"
        :active="modelValue.inputType === DataPointInputType.Dropdown"
        @click="setInputType(DataPointInputType.Dropdown)">
        {{ $t('calendar.plan.input_types.dropdown') }}
      </ly-button>
    </div>

    <div class="flex flex-row items-center items-stretch gap-0.5">
      <ly-input-text
        v-model="newOption"
        class="mb-0 grow"
        input-class="attachment-r"
        label="calendar.plan.labels.add_option" />
      <ly-button class="primary rounded-r w-12" @click="addOption"> + </ly-button>
    </div>
    <div v-for="option in modelValue.options" :key="option" class="flex">
      <div class="bg-highlight border border-divide p-2 rounded-l clearfix grow">
        {{ option }}
      </div>
      <ly-button class="danger float-right rounded-r w-12" @click="removeOption(option)">
        <ly-icon name="delete" />
      </ly-button>
    </div>

    <div v-if="modelValue.inputType !== DataPointInputType.Dropdown" class="text-xs">
      <ly-input-checkbox property="showOther" label="calendar.plan.labels.showOther" />
    </div>
  </div>
</template>

<style scoped></style>
