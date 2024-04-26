import type { IChartConfig } from '../interfaces';
import type { BaseModelData } from '@lyvely/common';
import { BaseModel } from '@lyvely/common';
import { CalendarInterval } from '@lyvely/dates';
import { ChartSeriesConfigModel } from './chart-series-config.model';
import { Exclude, Expose } from 'class-transformer';
import { ChartModel } from './chart.model';
import { TIME_SERIES_CHART } from './time-series-chart.category';

@Exclude()
export class TimeSeriesChartConfigModel implements IChartConfig {
  category = TIME_SERIES_CHART.id;

  @Expose()
  interval: CalendarInterval;

  @Expose()
  series: ChartSeriesConfigModel[];

  constructor(data: BaseModelData<TimeSeriesChartConfigModel>) {
    BaseModel.init(this, data);
  }
}

/**
 * Checks whether the given chart is a graph chart.
 *
 * @param {ChartModel} chart - The chart to be checked.
 * @returns {boolean} - Returns true if the chart is a graph chart, otherwise returns false.
 */
export function isTimeSeriesChart<T = string>(
  chart: ChartModel<T>,
): chart is ChartModel<T, TimeSeriesChartConfigModel> {
  return chart.config.category === TIME_SERIES_CHART.id;
}
