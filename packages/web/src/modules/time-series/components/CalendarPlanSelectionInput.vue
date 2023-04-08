<script lang="ts" setup>
import { ISelectionDataPointValue, ISelectionDataPointSettings } from '@lyvely/common';
import { computed } from 'vue';
import LyInputCheckbox from '@/modules/ui/components/form/CheckboxInput.vue';

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
</script>

<template>
  <div class="flex flex-col gap-2 ml-2">
    {{ modelValue.selection }}
    <div v-for="option in config.options" :key="option">
      <ly-input-checkbox v-model="selection" :label="option" :value="option" :translate="false" />
    </div>
  </div>
</template>

<style></style>
