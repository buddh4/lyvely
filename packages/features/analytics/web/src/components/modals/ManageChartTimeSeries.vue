<script lang="ts" setup>
import { computed } from 'vue';
import { LyModal, LyDimmed, LyIcon } from '@lyvely/ui';
import { useUpsertChartSeriesStore } from '@/store';
import type { ChartModel } from '@lyvely/analytics-interface';
import { getChartDefinition } from '@/registries';

export interface IProps {
  modelValue: boolean;
  chart: ChartModel;
}

const props = defineProps<IProps>();
const emit = defineEmits(['update:modelValue']);

const show = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

const { reset, submit } = useUpsertChartSeriesStore();

function updateSeries(sid: string) {
  useUpsertChartSeriesStore().updateSeries(props.chart, sid);
}

function addSeries() {
  useUpsertChartSeriesStore().addSeries(props.chart);
}

function getSeriesTypeName(seriesId: string) {
  return getChartDefinition(seriesId)?.label || '';
}
</script>

<template>
  <ly-modal
    v-model="show"
    title="analytics.series.manage.title"
    :submit-button="false"
    cancel-button-text="common.close"
    @close="reset"
    @submit="submit">
    <div class="grid max-w-full grid-cols-1 flex-wrap gap-1 md:grid-cols-2">
      <div
        v-for="series in chart.config.series"
        :key="series.id"
        role="button"
        tabindex="0"
        class="border-divide flex w-full flex-col gap-1 rounded border p-4 text-sm"
        @click="updateSeries(series.id)"
        @keyup.enter="updateSeries(series.id)">
        <b>{{ series.name }}</b>
        <ly-dimmed class="text-xs" :truncate="true" :text="getSeriesTypeName(series.type)" />
      </div>
      <button
        class="border-divide flex w-full flex-col items-center justify-center rounded border p-4"
        role="button"
        @click="addSeries">
        <ly-icon name="add-chart" />
      </button>
    </div>
  </ly-modal>
</template>

<style scoped></style>
