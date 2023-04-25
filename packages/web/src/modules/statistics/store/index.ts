import { defineStore } from 'pinia';
import statisticsRepository from '@/modules/statistics/repositories/statistics.repository';
import { ScoreStatistics } from '@lyvely/common';
import { ref } from 'vue';

export const useStatisticsStore = defineStore('statistics', () => {
  const loaded = ref(false);
  const year = new Date().getFullYear();
  const monthly = new ScoreStatistics({});
  const daily = new ScoreStatistics({});
  async function loadStatistics() {
    try {
      const { data } = await statisticsRepository.getMonthly();
      this.monthly = new ScoreStatistics(data);
      const { data: dailyData } = await statisticsRepository.getDaily();
      this.daily = new ScoreStatistics(dailyData);
    } catch (e) {
      //TODO: Implement
    }
  }

  return {
    loaded,
    year,
    loadStatistics,
    monthly,
    daily,
  };
});
