import type { IChartConfig } from '../interfaces';
import { ChartCategory } from '../interfaces';
import type { BaseModelData } from '@lyvely/common';
import { BaseModel } from '@lyvely/common';
import { CalendarInterval } from '@lyvely/dates';
import { ChartSeriesConfigModel } from './chart-series-config.model';
import { Exclude, Expose } from 'class-transformer';
import { ChartModel } from './chart.model';

@Exclude()
export class GraphChartConfigModel implements IChartConfig {
  category = ChartCategory.Graph;

  @Expose()
  interval: CalendarInterval;

  @Expose()
  series: ChartSeriesConfigModel[];

  constructor(data: BaseModelData<GraphChartConfigModel>) {
    BaseModel.init(this, data);
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
  return chart.config.category === ChartCategory.Graph;
}
