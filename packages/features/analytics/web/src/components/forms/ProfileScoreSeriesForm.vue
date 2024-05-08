<script setup lang="ts">
import { ProfileScoreSeriesConfigModel } from '@lyvely/analytics-interface';
import { I18nModelValidator, TagPicker } from '@lyvely/web';
import { LyFormModel, useModel, LyColorPicker } from '@lyvely/ui';
import { computed } from 'vue';
import TimeSeriesChartTypeSelection from './TimeSeriesChartTypeSelection.vue';

const props = defineProps({
  modelValue: ProfileScoreSeriesConfigModel<string>,
});

const emit = defineEmits(['update:modelValue']);

const { formValue } = useModel(props.modelValue!, emit);

const validator = computed(() => new I18nModelValidator(formValue.value));
</script>

<template>
  <div>
    <ly-form-model v-model="formValue" :validator="validator">
      <ly-color-picker v-model="formValue.color" label="common.fields.color" />
      <time-series-chart-type-selection v-model="formValue.chartType" />
      <tag-picker v-model="formValue.tagIds" label="common.fields.tags" />
    </ly-form-model>
  </div>
</template>

<style scoped></style>
