import { ITimeSeriesSummary } from '../interfaces';
import { CalendarInterval } from '@lyvely/dates';
import { CalendarPlan, getTidWindow } from '@lyvely/calendar-plan-interface';
import type { ICalendarPreferences } from '@lyvely/dates';

export interface IMovingAverageData {
  tid: string;
  value: number;
  fixedValue: string;
  difference: number;
}

export class MovingAverageCalculator {
  windowSize: number;
  values: number[];

  constructor(windowSize: number) {
    this.windowSize = windowSize;
    this.values = [];
  }

  addValue(value: number) {
    this.values.push(value);
    if (this.values.length > this.windowSize) {
      this.values.shift();
    }
  }

  getMovingAverage() {
    const sum = this.values.reduce((acc, val) => acc + val, 0);
    return sum / this.values.length;
  }

  isFull() {
    return this.values.length === this.windowSize;
  }

  static calculateMovingAverage(
    summary: ITimeSeriesSummary,
    interval: CalendarInterval,
    locale: string,
    preferences: ICalendarPreferences | undefined,
    windowSize?: number
  ) {
    const calendarPlan = CalendarPlan.getInstance(interval); // 7-day moving average
    windowSize ||= calendarPlan.getDefaultWindowSize();
    const averageWindowSize = Math.min(windowSize, Math.ceil(summary.window.length / 2));
    const calculator = new MovingAverageCalculator(averageWindowSize);

    const tids: string[] = getTidWindow(interval, locale, windowSize, preferences);
    const values: number[] = [];
    const movingAverages: Array<number | null> = [];
    const differences: Array<number | null> = [];

    for (let i = 0; i < tids.length; i++) {
      const tid = tids[i];
      const { value } = summary.window.find((entry) => entry.tid === tid) || { value: 0 };

      values.push(value);
      calculator.addValue(value);

      if (calculator.isFull()) {
        movingAverages.push(calculator.getMovingAverage());
        differences.push(value - Math.min(...calculator.values));
      } else {
        movingAverages.push(null);
        differences.push(null);
      }
    }

    return { tids, values, movingAverages, differences, windowSize, averageWindowSize };
  }

  reset() {
    this.values = [];
  }
}
