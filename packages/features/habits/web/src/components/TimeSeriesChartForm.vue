<script setup lang="ts">
import { I18nModelValidator } from '@lyvely/web';
import { LyFormModel, useModel, LyColorPicker } from '@lyvely/ui';
import { computed } from 'vue';
import { TimeSeriesChartTypeSelection } from '@lyvely/analytics-web';
import { TimeSeriesValueChartConfigModel } from '@lyvely/time-series-web';

const props = defineProps<{
  modelValue: TimeSeriesValueChartConfigModel<string>;
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
    </ly-form-model>
  </div>
</template>

<style scoped></style>
