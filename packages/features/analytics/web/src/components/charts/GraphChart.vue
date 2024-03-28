<script setup lang="ts">
import {
  ChartModel,
  useChartsClient,
  ChartSeriesDataResponse,
  isGraphChart,
} from '@lyvely/analytics-interface';
import { computed, onMounted, type Ref, ref, watch } from 'vue';
import {
  getDailyChartAxisCategories,
  getMonthlyChartAxisCategories,
  getYearlyChartAxisCategories,
} from '@/helpers';
import * as echarts from 'echarts/core';
import { LyButton, LyIcon } from '@lyvely/ui';
import { subtractDays, subtractYears, subtractMonths } from '@lyvely/dates';

const props = defineProps<{ model: ChartModel<string> }>();

const chartRoot = ref<HTMLElement>();
let chart: echarts.EChartsType;

const hasSeries = computed(() => !!props.model.config?.series?.length);
const chartData = ref<ChartSeriesDataResponse | undefined>();
const error = ref<string | undefined>();

type IntervalFilter = '7D' | '1M' | '6M' | '1Y' | '3Y';
const filters: IntervalFilter[] = ['7D', '1M', '6M', '1Y', '3Y'];
const axisData: Record<IntervalFilter, string[]> = {
  '7D': getDailyChartAxisCategories(subtractDays(new Date(), 7), new Date()),
  '1M': getDailyChartAxisCategories(subtractMonths(new Date(), 1), new Date()),
  '6M': getMonthlyChartAxisCategories(subtractMonths(new Date(), 6), new Date()),
  '1Y': getMonthlyChartAxisCategories(subtractYears(new Date(), 1), new Date()),
  '3Y': getYearlyChartAxisCategories(subtractYears(new Date(), 3), new Date()),
};

const intervalFilter: Ref<IntervalFilter> = ref('7D');

watch(chartData, renderChart);
watch(intervalFilter, renderChart);

function renderChart() {
  const chart = props.model;

  if (!chartRoot.value) return;
  if (!isGraphChart(chart)) return;

  chart.config.interval;

  const echart = echarts.init(chartRoot.value!);

  echart.setOption({
    tooltip: {},
    legend: {
      data: [],
    },
    xAxis: {
      type: 'category',
      data: axisData[intervalFilter.value],
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
  //useEditChartSeriesStore().addSeries(props.model.id, ChartCategory.Graph);
}

onMounted(async () => {
  chartData.value = await useChartsClient().getSeriesData(props.model.id);
});
</script>

<template>
  <div class="w-full h-full">
    <div v-if="!hasSeries" class="w-full h-full items-center justify-center relative flex">
      <ly-button @click="addSeries()">
        <ly-icon name="add-chart" class="w-10" />
      </ly-button>
    </div>
    <div v-else>
      <div class="flex gap-1.5 text-xs my-2">
        <ly-button
          v-for="filter in filters"
          :key="filter"
          class="secondary outlined inline-flex items-center py-0.5 px-1 text-xs"
          :text="`analytics.filters.${filter}`"
          :active="intervalFilter === filter"
          @click="intervalFilter = filter" />
      </div>
      <div ref="chartRoot" style="width: 100%; height: 250px"></div>
    </div>

    <!--edit-graph-series-modal :cid="model.id" / -->
  </div>
</template>

<style scoped></style>
