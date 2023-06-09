<script lang="ts" setup>
import { useStatisticsStore } from '@/modules/statistics/store';
import { onMounted, ref, watch } from 'vue';
import { usePageStore } from '@/modules/core/store/page.store';
import { storeToRefs } from 'pinia';

const cardClass = 'rounded border border-divide bg-main p-5 drop-shadow-md';
const addCardClass = 'rounded border border-divide p-5 drop-shadow-md cursor-pointer';
/*
const dailyChart = ref<Chart>();
const monthlyChart = ref<Chart>();
const { isDark } = storeToRefs(usePageStore());

watch(isDark, (newValue) => {
  const color = newValue ? '#fff' : '#000';
  dailyChart.value!.config.options!.color = color;
  dailyChart.value?.update();
  monthlyChart.value?.update();
});

onMounted(async () => {
  Chart.defaults.color = isDark.value ? '#fff' : '#000';
  Chart.register(...registerables);
  await useStatisticsStore().loadStatistics();
  const dailyContext = (<HTMLCanvasElement>document.getElementById('dailyChart'))?.getContext('2d');
  dailyChart.value = new Chart(dailyContext!, <any>useStatisticsStore().daily.getChart());

  const monthlyContext = (<HTMLCanvasElement>document.getElementById('monthlyChart'))?.getContext(
    '2d',
  );
  monthlyChart.value = new Chart(monthlyContext!, <any>useStatisticsStore().monthly.getChart());
});
 */
</script>

<template>
  <ly-content-root>
    <div class="grid grid-cols-3 gap-4">
      <div :class="cardClass">
        <div class="text-sm font-bold flex justify-center">Daily scores</div>
        <canvas id="dailyChart" width="200" height="200"></canvas>
      </div>
      <div :class="cardClass">
        <div class="text-sm font-bold flex justify-center">Monthly scores 2023</div>
        <canvas id="monthlyChart" width="200" height="200"></canvas>
      </div>
      <div :class="addCardClass">
        <div
          class="flex justify-center items-center w-full h-full text-9xl text-secondary dark:text-secondary-dark">
          +
        </div>
      </div>
    </div>
  </ly-content-root>
</template>

<style scoped></style>
