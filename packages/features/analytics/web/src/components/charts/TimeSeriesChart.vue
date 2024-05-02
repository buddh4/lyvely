<script setup lang="ts">
import {
  CHART_SERIES_USER_SCORE,
  ChartModel,
  getChartCategoryByKey,
  getTimeSeriesIntervalXAxis,
  isTimeSeriesChart,
  type ITimeSeriesChartConfig,
  type ITimeSeriesChartSeriesConfig,
  TimeSeriesAggregationInterval,
  type TimeSeriesChartData,
  type TimeSeriesChartDataResponse,
  TimeSeriesChartType,
  timeSeriesIntervalFilters,
  useChartsClient,
} from '@lyvely/analytics-interface';
import { computed, onMounted, type Ref, ref, watch } from 'vue';
import * as echarts from 'echarts/core';
import { LyButton, LyIcon } from '@lyvely/ui';
import { useI18nStore, useProfileStore } from '@lyvely/web';
import { useUpsertChartSeriesStore } from '@/store';
import EditTimeSeriesChartModal from '../modals/UpsertChartTimeSeries.vue';
import ManageChartTimeSeries from '@/components/modals/ManageChartTimeSeries.vue';
import { type ChartErrorData, ChartSeriesDataTypes } from '@lyvely/analytics-interface/src';

const props = defineProps<{ model: ChartModel<string, ITimeSeriesChartConfig> }>();

const chartRoot = ref<HTMLElement>();
const showManageSeries = ref(false);

const locale = useI18nStore().locale;
const axisData = getTimeSeriesIntervalXAxis(locale);

const hasSeries = computed(() => !!props.model.config?.series?.length);
const chartData = ref<TimeSeriesChartDataResponse>();
const intervalFilter: Ref<TimeSeriesAggregationInterval> = ref('7D');

watch(chartData, renderChart);
watch(() => props.model, renderChart);
watch(intervalFilter, loadSeriesData);

interface IChartSeries {
  data: number[];
  type: string;
  name: string;
}

async function transformResponseToChartData(
  response: TimeSeriesChartDataResponse,
): Promise<IChartSeries[]> {
  const { result } = response;
  const chartSeries = [];

  for (const seriesId in result) {
    const seriesData = result[seriesId];
    chartSeries.push(...(await transformSeriesData(seriesId, seriesData)));
  }

  return chartSeries;
}

async function transformSeriesData(
  seriesId: string,
  seriesData: TimeSeriesChartData[],
): Promise<IChartSeries[]> {
  const seriesConfig = props.model.config.series.find((s) => s.id === seriesId);
  if (!seriesConfig) {
    console.error(`Series ${seriesId} does not exist in chart`);
    return [];
  }

  const result = [];
  for (const series of seriesData) {
    try {
      result.push(await transformSeries(seriesConfig, series));
    } catch (e) {
      console.error(e);
    }
  }

  return result;
}

async function transformSeries(
  seriesConfig: ITimeSeriesChartSeriesConfig,
  series: TimeSeriesChartData | ChartErrorData,
): Promise<IChartSeries> {
  if (series.type === ChartSeriesDataTypes.ERROR) {
    throw new Error(series.data);
  }

  const data = axisData[intervalFilter.value].map(
    (category: string) =>
      series.data.find(
        (val) => getChartCategoryByKey(val.key, intervalFilter.value, locale) === category,
      )?.value || 0,
  );

  const type = series.chartType || seriesConfig.chartType || TimeSeriesChartType.Line;

  const name =
    seriesConfig.type === CHART_SERIES_USER_SCORE.id
      ? (await useProfileStore().getUserInfo(series.name))?.displayName || series.name
      : series.name;

  return { data, type, name };
}

async function renderChart() {
  const chart = props.model;

  if (!chartRoot.value) return;
  if (!chartData.value) return;
  if (!isTimeSeriesChart(chart)) return;

  const series = await transformResponseToChartData(chartData.value);

  const echart = echarts.init(chartRoot.value!);
  echart.setOption({
    tooltip: {},
    legend: {
      data: series.map((s) => s.name),
    },
    xAxis: {
      type: 'category',
      data: axisData[intervalFilter.value],
    },
    yAxis: {},
    series,
  });
}

function addSeries() {
  useUpsertChartSeriesStore().addSeries(props.model);
}

async function loadSeriesData() {
  chartData.value = await useChartsClient().getSeriesData(props.model.id, {
    intervalFilter: intervalFilter.value,
  });
}

onMounted(loadSeriesData);
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
        <ly-button
          class="secondary outlined inline-flex items-center py-0.5 px-1 text-xs ml-auto"
          @click="showManageSeries = true">
          <ly-icon name="settings" class="w-3" />
        </ly-button>
      </div>
      <div ref="chartRoot" style="width: 100%; height: 250px"></div>
    </div>

    <edit-time-series-chart-modal />
    <manage-chart-time-series v-model="showManageSeries" :chart="model" />
  </div>
</template>

<style scoped></style>
