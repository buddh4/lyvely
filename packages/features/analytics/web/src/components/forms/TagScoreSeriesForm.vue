<script setup lang="ts">
import { TagPicker } from '@lyvely/web';
import { useModel } from '@lyvely/ui';
import { TagScoreSeriesConfigModel } from '@lyvely/analytics-interface';
import TimeSeriesChartTypeSelection from '@/components/forms/TimeSeriesChartTypeSelection.vue';

const props = defineProps({
  modelValue: TagScoreSeriesConfigModel<string>,
});

const emit = defineEmits(['update:modelValue']);

const { formValue } = useModel(props.modelValue!, emit);
</script>

<template>
  <div>
    <time-series-chart-type-selection v-model="formValue.chartType" />
    <tag-picker v-model="formValue.tagIds" label="analytics.fields.tags" />
  </div>
</template>

<style scoped></style>
