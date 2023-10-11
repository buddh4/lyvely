<script lang="ts" setup>
import { MovingAverageCalculator, ITimeSeriesSummary } from '@lyvely/time-series-interface';
import { CalendarInterval } from '@lyvely/dates';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import * as echarts from 'echarts/core';
import { storeToRefs } from 'pinia';
import { useProfileStore } from '@/profiles/stores/profile.store';
import { translate } from '@/i18n';
import { usePageStore } from '@/core';

export interface IProps {
  summary: ITimeSeriesSummary;
  interval: CalendarInterval;
  showTrend?: boolean;
  width?: string | number;
  height?: string | number;
}

const props = withDefaults(defineProps<IProps>(), {
  width: '100%',
  height: '100%',
  showTrend: true,
});

const { locale } = storeToRefs(useProfileStore());

const chartRoot = ref<HTMLElement>();
let chart: echarts.EChartsType;

watch(
  () => props.summary,
  () => renderSummaryChart(props.summary),
  { deep: true },
);

const { isDark } = storeToRefs(usePageStore());

const textStyle = computed(() => ({ color: isDark.value ? '#f3f4f6' : '#4b5563' }));

watch(isDark, () => {
  if (!chart) return;
  renderSummaryChart(props.summary);
});

const onResize = () => chart?.resize();

function renderSummaryChart(summary: ITimeSeriesSummary) {
  const { tids, values, movingAverages } = MovingAverageCalculator.calculateMovingAverage(
    summary,
    props.interval,
    locale.value!,
  );

  chart = echarts.init(chartRoot.value!);

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
        [translate('time-series.chart.value')]: true,
        [translate('time-series.chart.trend')]: false,
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
        name: translate('time-series.chart.value'),
        data: values,
        type: 'line',
        smooth: true,
        areaStyle: {},
      },
      {
        name: translate('time-series.chart.trend'),
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

onMounted(() => {
  renderSummaryChart(props.summary);
  window.addEventListener('resize', onResize);
});
onUnmounted(() => window.removeEventListener('resize', onResize));
</script>

<template>
  <div ref="chartRoot" :style="{ height, width }"></div>
</template>

<style scoped></style>
