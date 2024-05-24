<script setup lang="ts">
import { TimeSeriesChartType } from '@lyvely/analytics-interface';
import { t } from '@lyvely/web';
import { LyButton } from '@lyvely/ui';
import { computed } from 'vue';

const props = defineProps<{ modelValue: TimeSeriesChartType }>();
const emit = defineEmits(['update:modelValue']);
const type = computed({
  get: () => props.modelValue,
  set: (val: TimeSeriesChartType) => emit('update:modelValue', val),
});
</script>

<template>
  <div class="mb-2 flex items-stretch justify-between gap-2">
    <ly-button
      class="secondary outlined w-full text-xs"
      :active="type === TimeSeriesChartType.Line"
      @click="type = TimeSeriesChartType.Line">
      {{ t('analytics.charts.types.line') }}
    </ly-button>

    <ly-button
      class="secondary outlined w-full text-xs"
      :active="type === TimeSeriesChartType.Bar"
      @click="type = TimeSeriesChartType.Bar">
      {{ t('analytics.charts.types.bar') }}
    </ly-button>
  </div>
</template>

<style scoped></style>
