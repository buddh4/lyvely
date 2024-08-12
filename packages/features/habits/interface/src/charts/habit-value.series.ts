import { Exclude, Expose } from 'class-transformer';
import { IChartSeriesDefinition, TIME_SERIES_CHART } from '@lyvely/analytics-interface';
import { TimeSeriesValueChartConfigModel } from '@lyvely/time-series-interface';

@Exclude()
export class HabitValueSeriesConfigModel<
  TID = string,
> extends TimeSeriesValueChartConfigModel<TID> {
  @Expose()
  override readonly type = CHART_SERIES_HABIT_VALUE.id;
}

export const CHART_SERIES_HABIT_VALUE: IChartSeriesDefinition = {
  id: 'habit-value',
  configType: HabitValueSeriesConfigModel,
  categoryTypes: [TIME_SERIES_CHART.id],
};
