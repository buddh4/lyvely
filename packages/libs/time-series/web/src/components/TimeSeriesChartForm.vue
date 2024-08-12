<script setup lang="ts">
import { I18nModelValidator, ContentPickerResult } from '@lyvely/web';
import { LyFormModel, useModel, LyColorPicker, type Translatable } from '@lyvely/ui';
import { computed } from 'vue';
import TimeSeriesChartTypeSelection from '@lyvely/analytics-web';
import { TimeSeriesValueChartConfigModel } from '@lyvely/time-series-interface';

const props = defineProps<{
  modelValue: TimeSeriesValueChartConfigModel<string>;
  pickerTitle?: Translatable;
  pickerHandler: (search: string) => Promise<ContentPickerResult>;
}>();

const emit = defineEmits(['update:modelValue']);

const { formValue } = useModel(props.modelValue!, emit);

const validator = computed(() => new I18nModelValidator(formValue.value));
</script>

<template>
  <div>
    <ly-form-model v-model="formValue" :validator="validator">
      <ly-color-picker v-model="formValue.color" label="common.fields.color" />
      <time-series-chart-type-selection v-model="formValue.chartType" />
      <content-picker :title="pickerTitle" :handler="pickerHandler" :max="1" />
    </ly-form-model>
  </div>
</template>

<style scoped></style>
