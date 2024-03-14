<script setup lang="ts">
import {
  ChartModel,
  ChartType,
  useChartsClient,
  ChartSeriesDataResponse,
  isGraphChart,
} from '@lyvely/analytics-interface';
import { computed, onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts/core';
import EditGraphSeriesModal from '@/components/modals/EditGraphSeriesModal.vue';
import { useEditChartSeriesStore } from '@/store';
import { LyButton, LyIcon } from '@lyvely/ui';

const props = defineProps<{ model: ChartModel<string> }>();

const chartRoot = ref<HTMLElement>();
let chart: echarts.EChartsType;

const hasSeries = computed(() => !!props.model.config?.series?.length);
const chartData = ref<ChartSeriesDataResponse | undefined>();
const error = ref<string | undefined>();

watch(chartData, renderChart);

function renderChart() {
  const chart = props.model;

  if (!chartRoot.value) return;
  if (!isGraphChart(chart)) return;

  chart.config.interval;

  echart = echarts.init(chartRoot.value!);

  props.model.chart.setOption({
    tooltip: {},
    legend: {
      data: [],
    },
    xAxis: {
      data: [],
    },
    yAxis: {},
    series: [],
  });

  /*echart!.setOption({
    tooltip: {
      trigger: 'axis',
      position: function (pt: number[]) {
        return [pt[0], '10%'];
      },
      axisPointer: {
        label: {
          show: true,
        },
      },
    },
    textStyle: textStyle.value,
    legend: {
      textStyle: textStyle.value,
      selected: {
        [t('time-series.chart.value')]: true,
        [t('time-series.chart.trend')]: false,
      },
    },
    xAxis: {
      type: 'category',
      data: tids.map((tid: string) => tid.split(';').at(-1)),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: t('time-series.chart.value'),
        data: values,
        type: 'line',
        smooth: true,
        areaStyle: {},
      },
      {
        name: t('time-series.chart.trend'),
        data: movingAverages,
        type: 'line',
        smooth: true,

        lineStyle: {
          width: 2,
        },
      },
    ],
  });*/
}

function addSeries() {
  useEditChartSeriesStore().addSeries(props.model.id, ChartType.Graph);
}

onMounted(async () => {
  await useChartsClient().getSeriesData(props.model.id);
});
</script>

<template>
  <div class="w-full h-full">
    <div v-if="!hasSeries" class="w-full h-full items-center justify-center relative flex">
      <ly-button @click="addSeries()">
        <ly-icon name="add-chart" class="w-10" />
      </ly-button>
    </div>
    <div v-else ref="chartRoot" style="width: 100%; height: 250px"></div>
    <edit-graph-series-modal :cid="model.id" />
  </div>
</template>

<style scoped></style>
