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
  <div class="flex gap-2 justify-between items-stretch mb-2">
    <ly-button
      class="text-xs secondary w-full outlined"
      :active="type === TimeSeriesChartType.Line"
      @click="type = TimeSeriesChartType.Line">
      {{ t('analytics.charts.types.line') }}
    </ly-button>

    <ly-button
      class="text-xs secondary w-full outlined"
      :active="type === TimeSeriesChartType.Bar"
      @click="type = TimeSeriesChartType.Bar">
      {{ t('analytics.charts.types.bar') }}
    </ly-button>
  </div>
</template>

<style scoped></style>
