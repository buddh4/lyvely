import {
  CalendarInterval,
  getDayNames,
  getLocalizedDays,
  getLocalizedMonths,
  getMonthNames,
} from '@lyvely/dates';
import { CalendarPlan } from '@lyvely/calendar-plan';

abstract class Statistics {
  title: string;
  data: any[];
}

export interface IScoreStatisticsDataset {
  id: string;
  score: number;
}

export class ScoreStatistics extends Statistics {
  data: IScoreStatisticsDataset[];
  interval: CalendarInterval;

  constructor(obj: Partial<ScoreStatistics>) {
    super();
    this.title = obj.title;
    this.data = obj.data;
    this.interval = obj.interval;
  }

  getChart() {
    return {
      type: 'bar',
      data: {
        labels: this.getChartLabels(),
        datasets: [
          {
            label: 'score',
            backgroundColor: 'rgb(25, 135, 84)',
            borderColor: 'rgb(255, 170, 100)',
            data: this.getData(),
          },
        ],

        borderWidth: 1,
      },
      options: {},
    };
  }

  getData() {
    const result = [];
    this.getDataSetIds().forEach((id) => {
      result.push(this.getScore(id));
    });
    return result;
  }

  getDataSetIds() {
    switch (this.interval) {
      case CalendarInterval.Monthly:
        return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11];
      case CalendarInterval.Daily:
        return [0, 1, 2, 3, 4, 5, 6, 7];
    }
  }

  getScore(dataSetId: any) {
    const dataset = this.data.find((dataset) => dataset.id === dataSetId);
    if (dataset) {
      return dataset.score;
    }

    return 0;
  }

  getChartLabels() {
    switch (this.interval) {
      case CalendarInterval.Monthly:
        return getLocalizedMonths('short');
      case CalendarInterval.Daily:
        return getLocalizedDays('short');
    }

    return [];
  }

  getLabelByDatasetId(id: string) {
    return CalendarPlan.getInstance(this.interval).getLabelById(id);
  }
}
