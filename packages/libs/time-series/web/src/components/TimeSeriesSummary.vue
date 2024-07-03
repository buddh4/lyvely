<script lang="ts" setup>
import {
  MovingAverageCalculator,
  DataPointValueType,
  TimeSeriesContentModel,
} from '@lyvely/time-series-interface';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { init, type EChartsType, use } from 'echarts/core';
import { storeToRefs } from 'pinia';
import { useProfileStore, t, usePageStore, useAuthStore } from '@lyvely/web';
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

export interface IProps {
  model: TimeSeriesContentModel;
  showTrend?: boolean;
  width?: string | number;
  height?: string | number;
}

const props = withDefaults(defineProps<IProps>(), {
  width: '100%',
  height: '100%',
  showTrend: true,
});

const profileStore = useProfileStore();
const { locale } = storeToRefs(profileStore);

const chartRoot = ref<HTMLElement>();
let chart: EChartsType;

const summary = computed(() => props.model.getSummary(useAuthStore().user?.id));

// We need the setTimeout if the summary is initialized, I assume the rendering conflicts with the style update.
watch(summary, () => setTimeout(renderSummaryChart, 100), { deep: true });

const { isDark } = storeToRefs(usePageStore());

const textStyle = computed(() => ({ color: isDark.value ? '#f3f4f6' : '#4b5563' }));

watch(isDark, () => {
  if (!chart) return;
  renderSummaryChart();
});

const onResize = () => chart?.resize();

function renderSummaryChart() {
  const timeSeriesSummary = summary.value;
  if (!timeSeriesSummary) return;

  const { tids, values, movingAverages } = MovingAverageCalculator.calculateMovingAverage(
    timeSeriesSummary,
    props.model.interval,
    locale.value!,
    profileStore.getSetting('calendar')
  );

  chart = init(chartRoot.value!);

  chart!.setOption({
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
      axisLabel: {
        formatter: (value: number) => {
          if (props.model.timeSeriesConfig.valueType !== DataPointValueType.Timer) return value;
          const hours = Math.floor(value / 3600000);
          const minutes = Math.floor((value - hours * 3600000) / 60000);
          const seconds = ((value % 60000) / 1000).toFixed(0);

          return (
            hours.toString().padStart(2, '0') +
            ':' +
            minutes.toString().padStart(2, '0') +
            ':' +
            seconds.toString().padStart(2, '0')
          );
        },
      },
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
  });
}

const style = computed(() => ({
  height: summary.value ? props.height : 0,
  width: summary.value ? props.width : 0,
}));

onMounted(() => {
  renderSummaryChart();
  window.addEventListener('resize', onResize);
});
onUnmounted(() => window.removeEventListener('resize', onResize));
</script>

<template>
  <div ref="chartRoot" :style="style"></div>
</template>

<style scoped></style>
