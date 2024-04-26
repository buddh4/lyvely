<script setup lang="ts">
import {
  ChartModel,
  useChartsClient,
  isTimeSeriesChart,
  TimeSeriesAggregationInterval,
  getChartCategoryByKey,
  getTimeSeriesIntervalXAxis,
  timeSeriesIntervalFilters,
  type TimeSeriesChartData,
  type TimeSeriesChartDataResponse,
  type ITimeSeriesChartConfig,
  type ITimeSeriesChartSeriesConfig,
  TimeSeriesChartType,
} from '@lyvely/analytics-interface';
import { computed, onMounted, type Ref, ref, watch } from 'vue';
import * as echarts from 'echarts/core';
import { LyButton, LyIcon } from '@lyvely/ui';
import { useI18nStore } from '@lyvely/web';

const props = defineProps<{ model: ChartModel<string, ITimeSeriesChartConfig> }>();

const chartRoot = ref<HTMLElement>();

const locale = useI18nStore().locale;
const axisData = getTimeSeriesIntervalXAxis(locale);

const hasSeries = computed(() => !!props.model.config?.series?.length);
const chartData = ref<TimeSeriesChartDataResponse>();
const intervalFilter: Ref<TimeSeriesAggregationInterval> = ref('7D');

watch(chartData, renderChart);
watch(intervalFilter, renderChart);

interface IChartSeries {
  data: number[];
  type: string;
  name: string;
}

function transformResponseToChartData(response: TimeSeriesChartDataResponse): IChartSeries[] {
  const { result } = response;
  return Object.keys(result).reduce((chartSeries, seriesId) => {
    const seriesData = result[seriesId];
    chartSeries.push(...transformSeriesData(seriesId, seriesData));
    return chartSeries;
  }, [] as IChartSeries[]);
}

function transformSeriesData(seriesId: string, seriesData: TimeSeriesChartData[]): IChartSeries[] {
  const seriesConfig = props.model.config.series.find((s) => s.id === seriesId);
  if (!seriesConfig) {
    console.error(`Series ${seriesId} does not exist in chart`);
    return [];
  }
  return seriesData.map((series) => transformSeries(seriesConfig, series));
}

function transformSeries(
  seriesConfig: ITimeSeriesChartSeriesConfig,
  series: TimeSeriesChartData,
): IChartSeries {
  const data = axisData[intervalFilter.value].map(
    (category: string) =>
      series.data.find(
        (val) => getChartCategoryByKey(val.key, intervalFilter.value, locale) === category,
      )?.value || 0,
  );

  const type = series.chartType || seriesConfig.chartType || TimeSeriesChartType.Line;

  return { data, type, name: series.name };
}

function renderChart() {
  const chart = props.model;

  if (!chartRoot.value) return;
  if (!chartData.value) return;
  if (!isTimeSeriesChart(chart)) return;

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
    series: transformResponseToChartData(chartData.value),
  });
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
          v-for="filter in timeSeriesIntervalFilters"
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
