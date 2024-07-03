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
  type ChartErrorData,
  ChartSeriesDataTypes,
} from '@lyvely/analytics-interface';
import { computed, onMounted, onUnmounted, type Ref, ref, watch } from 'vue';
import { init, use, type EChartsType } from 'echarts/core';
import { LyButton, LyIcon, LyLoader } from '@lyvely/ui';
import {
  loadingStatus,
  useI18nStore,
  usePageStore,
  useProfileStore,
  useStatus,
  t,
} from '@lyvely/web';
import { useUpsertChartSeriesStore } from '@/store';
import EditTimeSeriesChartModal from '../modals/UpsertChartTimeSeries.vue';
import ManageChartTimeSeries from '@/components/modals/ManageChartTimeSeries.vue';
import { storeToRefs } from 'pinia';
import { BarChart, LineChart } from 'echarts/charts';
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  TransformComponent,
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

use([
  BarChart,
  LineChart,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);

const props = defineProps<{ model: ChartModel<string, ITimeSeriesChartConfig> }>();

const chartRoot = ref<HTMLElement>();
let echart: EChartsType;
const showManageSeries = ref(false);

const locale = useI18nStore().locale;
const axisData = getTimeSeriesIntervalXAxis(locale);

const hasSeries = computed(() => !!props.model.config?.series?.length);
const chartData = ref<TimeSeriesChartDataResponse>();
const intervalFilter: Ref<TimeSeriesAggregationInterval> = ref('7D');
const { isDark } = storeToRefs(usePageStore());
const textStyle = computed(() => ({ color: isDark.value ? '#f3f4f6' : '#4b5563' }));
const status = useStatus();

watch(chartData, renderChart);
watch(() => props.model, loadSeriesData);
watch(intervalFilter, loadSeriesData);
watch(isDark, renderChart);

interface IChartSeries {
  data: number[];
  type: string;
  name: string;
  color?: string;
  smooth?: boolean;
}

async function transformResponseToChartData(
  response: TimeSeriesChartDataResponse
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
  seriesData: TimeSeriesChartData[]
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
  series: TimeSeriesChartData | ChartErrorData
): Promise<IChartSeries> {
  if (series.type === ChartSeriesDataTypes.ERROR) {
    throw new Error(series.data);
  }

  const data = axisData[intervalFilter.value].map(
    (category: string) =>
      series.data.find(
        (val) => getChartCategoryByKey(val.key, intervalFilter.value, locale) === category
      )?.value || 0
  );

  const type = series.chartType || seriesConfig.chartType || TimeSeriesChartType.Line;

  const name =
    seriesConfig.type === CHART_SERIES_USER_SCORE.id
      ? (await useProfileStore().getUserInfo(series.name))?.displayName || series.name
      : series.name;

  return { data, type, name, color: series.color, smooth: true };
}

async function renderChart() {
  const chart = props.model;

  if (!chartRoot.value) return;
  if (!chartData.value) return;
  if (!isTimeSeriesChart(chart)) return;

  const series = await transformResponseToChartData(chartData.value);

  echart = init(chartRoot.value!);
  echart.setOption(
    {
      tooltip: {},
      textStyle: textStyle.value,
      legend: {
        textStyle: textStyle.value,
        data: series.map((s) => s.name),
      },
      xAxis: {
        type: 'category',
        data: axisData[intervalFilter.value],
      },
      yAxis: {},
      series,
    },
    true
  );
}

function addSeries() {
  useUpsertChartSeriesStore().addSeries(props.model);
}

const canWrite = computed(() => props.model.policies.canWrite);

async function loadSeriesData() {
  chartData.value = await loadingStatus(
    useChartsClient().getSeriesData(props.model.id, {
      interval: intervalFilter.value,
    }),
    status
  );
}

const onResize = () => echart?.resize();

onMounted(() => {
  loadSeriesData();
  window.addEventListener('resize', onResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', onResize);
});
</script>

<template>
  <div class="h-full w-full">
    <div v-if="!hasSeries" class="relative flex h-full w-full items-center justify-center">
      <div
        :class="[{ 'cursor-pointer': canWrite }, 'justify-center bg-main']"
        :role="canWrite ? 'button' : ''"
        @click="addSeries">
        <div class="flex flex-col items-center justify-center">
          <ly-icon name="task" class="w-20 text-gray-300 dark:text-gray-500" />
          <span v-if="canWrite" class="font-semibold">{{
            t('analytics.messages.empty-series-create')
          }}</span>
          <span v-else class="font-semibold">{{ t('analytics.messages.empty-series') }}</span>
        </div>
      </div>
    </div>
    <div v-else-if="status.isStatusSuccess()">
      <div class="my-2 flex gap-1.5 text-xs">
        <ly-button
          v-for="filter in timeSeriesIntervalFilters"
          :key="filter"
          class="secondary outlined inline-flex items-center px-1 py-0.5 text-xs"
          :text="`analytics.filters.${filter}`"
          :active="intervalFilter === filter"
          @click="intervalFilter = filter" />
        <ly-button
          v-if="canWrite"
          class="secondary outlined ml-auto inline-flex items-center px-1 py-0.5 text-xs"
          @click="showManageSeries = true">
          <ly-icon name="settings" class="w-3" />
        </ly-button>
      </div>
      <div ref="chartRoot" style="width: 100%; height: 250px"></div>
    </div>
    <div v-else class="h-64">
      <ly-loader />
    </div>

    <edit-time-series-chart-modal v-if="canWrite" />
    <manage-chart-time-series v-if="canWrite" v-model="showManageSeries" :chart="model" />
  </div>
</template>

<style scoped></style>
