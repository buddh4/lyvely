<script lang="ts" setup>
import { Chart, registerables } from "chart.js";
import { useStatisticsStore } from "@/modules/statistics/store";
import MainContainer from "@/modules/ui/components/layout/MainContainer.vue";
import { onBeforeMount } from "vue";

onBeforeMount(async () => {
  Chart.register(...registerables);
  try {
    await useStatisticsStore().loadStatistics();
    const ctx = (<HTMLCanvasElement>(
      document.getElementById("monthlyChart")
    ))?.getContext("2d");
    if (ctx) {
      new Chart(ctx, useStatisticsStore().monthly.getChart());
    }
  } catch (e) {
    // TODO:...
  }
});
</script>

<template>
  <MainContainer>
    <div class="row">
      <div class="col-sm-6">
        <div class="card">
          <div class="card-header">Yearly</div>
          <div class="card-body">
            <canvas id="monthlyChart" width="200" height="200"></canvas>
          </div>
          <div class="card-footer"></div>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="card">
          <div class="card-header">Monthly</div>
          <div class="card-body">
            <canvas id="monthlyChart2" width="200" height="200"></canvas>
          </div>
          <div class="card-footer"></div>
        </div>
      </div>
    </div>
  </MainContainer>
</template>

<style scoped></style>
