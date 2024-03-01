<script setup lang="ts">
import { ChartModel, GraphChartConfigModel } from '@lyvely/analytics-interface';
import { computed, onMounted, ref } from 'vue';
import * as echarts from 'echarts/core';
import { t } from '@lyvely/web';
import EditGraphSeriesModal from '@/components/modals/EditGraphSeriesModal.vue';
import { useEditGraphSeriesStore } from '@/store';

const props = defineProps<{ model: ChartModel<string, GraphChartConfigModel> }>();

const chartRoot = ref<HTMLElement>();
let chart: echarts.EChartsType;

const hasSeries = computed(() => !!props.model.config?.series?.length);

function renderChart() {
  if (!chartRoot.value) return;
  chart = echarts.init(chartRoot.value!);
  chart.setOption({
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

  /*chart!.setOption({
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
  useEditGraphSeriesStore().createSeries(props.model.id);
}

onMounted(() => {
  renderChart();
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
