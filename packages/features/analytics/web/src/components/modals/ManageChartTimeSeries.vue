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
  set: (val: boolean) => emit('update:modelValue'),
});

const { reset, submit, isCreate, model } = useUpsertChartSeriesStore();

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
    <div class="flex gap-1 max-w-full">
      <div
        v-for="series in chart.config.series"
        role="button"
        class="flex flex-col w-full md:w-1/2 gap-1 border border-divide rounded p-4 text-sm"
        @click="updateSeries(series.id)">
        <b>{{ series.name }}</b>
        <ly-dimmed class="text-xs" :truncate="true" :text="getSeriesTypeName(series.type)" />
      </div>
      <button
        class="flex flex-col w-full md:w-1/2 border border-divide rounded p-4 justify-center items-center"
        role="button"
        @click="addSeries">
        <ly-icon name="add-chart" />
      </button>
    </div>
  </ly-modal>
</template>

<style scoped></style>
