<script setup lang="ts">
import { TimeSeriesConfigModel } from '@lyvely/analytics-interface';
import { I18nModelValidator } from '@lyvely/web';
import { LyFormModel, useModel } from '@lyvely/ui';
import { computed } from 'vue';
import TimeSeriesChartTypeSelection from './TimeSeriesChartTypeSelection.vue';

const props = defineProps({
  modelValue: TimeSeriesConfigModel,
});

const emit = defineEmits(['update:modelValue']);

const { formValue } = useModel(props.modelValue!, emit);

const validator = computed(() => new I18nModelValidator(formValue.value));
</script>

<template>
  <div>
    <ly-form-model v-model="formValue" :validator="validator">
      <time-series-chart-type-selection v-model="formValue.chartType" />
    </ly-form-model>
  </div>
</template>

<style scoped></style>
