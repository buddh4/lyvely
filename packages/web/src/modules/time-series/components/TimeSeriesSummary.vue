<script lang="ts" setup>
import { MovingAverageCalculator, ITimeSeriesSummary, CalendarInterval } from '@lyvely/common';
import { onMounted, ref, watch, watchEffect } from 'vue';
import * as echarts from 'echarts/core';
import { storeToRefs } from 'pinia';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';

export interface IProps {
  summary: ITimeSeriesSummary;
  interval: CalendarInterval;
}

const props = defineProps<IProps>();
const { locale } = storeToRefs(useProfileStore());

const chartRoot = ref<HTMLElement>();

watch(
  () => props.summary,
  () => renderSummaryChart(props.summary),
  { deep: true },
);

function renderSummaryChart(summary: ITimeSeriesSummary) {
  const { tids, values, movingAverages, differences } =
    MovingAverageCalculator.calculateMovingAverage(summary, props.interval, locale.value!);

  const chart = echarts.init(chartRoot.value!, <any>null, { width: 500, height: 300 });

  chart.setOption({
    tooltip: {
      trigger: 'axis',
      position: function (pt: number[]) {
        return [pt[0], '10%'];
      },
    },
    legend: {},
    xAxis: {
      type: 'category',
      data: tids.map((tid: string) => tid.split(';').at(-1)),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Value',
        data: values,
        type: 'line',
        smooth: true,
        areaStyle: {},
      },
      {
        name: 'Trend',
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

onMounted(() => renderSummaryChart(props.summary));
</script>

<template>
  <div ref="chartRoot"></div>
</template>

<style scoped></style>
