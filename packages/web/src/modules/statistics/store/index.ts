import { defineStore } from 'pinia';
import statisticsRepository from '@server/modules/statistics/repositories/statistics.repository';
import { ScoreStatistics } from '@lyvely/common';

export const useStatisticsStore = defineStore('statistics', {
  state: () => ({
    loaded: false,
    year: new Date().getFullYear(),
    monthly: new ScoreStatistics({})
  }),
  actions: {
    async loadStatistics() {
      try {
        const { data } = await statisticsRepository.getMonthly();
        this.monthly = new ScoreStatistics(data);
        return this.monthly;
      } catch(e) {
        //TODO: Implement
      }
    }
  }
})
