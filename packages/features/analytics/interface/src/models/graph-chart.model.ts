import type { IChartConfig } from '../interfaces';
import { ChartType } from '../interfaces';
import type { PartialPropertiesOf } from '@lyvely/common';
import { Model } from '@lyvely/common';
import { CalendarInterval } from '@lyvely/dates';
import { ChartSeriesConfigModel } from './chart-series-config.model';
import { Expose } from 'class-transformer';
import { ChartModel } from './chart.model';

export class GraphChartConfigModel implements IChartConfig {
  type = ChartType.Graph;

  @Expose()
  interval: CalendarInterval;

  @Expose()
  series: ChartSeriesConfigModel[];

  constructor(data: PartialPropertiesOf<GraphChartConfigModel>) {
    Model.init(this, data);
  }
}

/**
 * Checks whether the given chart is a graph chart.
 *
 * @param {ChartModel} chart - The chart to be checked.
 * @returns {boolean} - Returns true if the chart is a graph chart, otherwise returns false.
 */
export function isGraphChart<T = string>(
  chart: ChartModel<T>,
): chart is ChartModel<T, GraphChartConfigModel> {
  return chart.config.type === ChartType.Graph;
}
