<script lang="ts" setup>
import { DataPointInputType, INumberDataPointSettings } from '@lyvely/time-series-interface';
import { computed } from 'vue';

interface IProps {
  modelValue: number;
  config: INumberDataPointSettings;
  disabled?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  disabled: false,
  timer: undefined,
});

const emit = defineEmits(['update:modelValue']);

const selection = computed({
  get: () => props.modelValue,
  set: (selection: number) => emit('update:modelValue', selection),
});

const inputColorClass = computed(() => {
  if (props.config.min && selection.value <= props.config.min) return 'warning';
  if (props.config.optimal && selection.value >= props.config.optimal) return 'success';
  if (selection.value) return 'success';
  return '';
});

const inputBorderColorClass = computed(() => {
  const color = inputColorClass.value;
  return color.length ? `border-${color}` : color;
});
</script>

<template>
  <div class="calendar-plan-number-input">
    <ly-checkbox-range
      v-if="config.inputType === DataPointInputType.Checkbox"
      v-model:selection="selection"
      :min="config.min"
      :max="config.max"
      :optimal="config.optimal"
      :disabled="disabled" />
    <ly-input-number
      v-else-if="config.inputType === DataPointInputType.Spinner"
      v-model="selection"
      :input-class="['calendar-plan-spinner-input text-sm bg-main', inputBorderColorClass]"
      :min="0"
      :max="config.max"
      :disabled="disabled" />
    <div v-else-if="config.inputType === DataPointInputType.Range" class="flex items-center gap-2">
      <span class="text-sm">{{ selection }}</span>
      <ly-input-range
        v-model="selection"
        :input-class="['calendar-plan-range-input', inputColorClass]"
        :min="0"
        :max="config.max"
        :disabled="disabled" />
    </div>
  </div>
</template>

<style>
.calendar-plan-number-input {
  max-width: 150px;
}

.calendar-plan-range-input {
  max-width: 130px;
  direction: rtl;
  clear: both;
}
</style>
