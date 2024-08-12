import { ChartSeriesSchemaFactory } from '@lyvely/analytics';
import { NestedSchema } from '@lyvely/api';
import { CHART_SERIES_HABIT_VALUE, HabitValueSeriesConfigModel } from '@lyvely/habits-interface';
import { type TObjectId } from '@lyvely/api';
import { TimeSeriesValueChartSeriesConfig } from '@lyvely/time-series';

@NestedSchema()
export class HabitValueChartSeriesConfig
  extends TimeSeriesValueChartSeriesConfig
  implements HabitValueSeriesConfigModel<TObjectId>
{
  override readonly type = CHART_SERIES_HABIT_VALUE.id;
}

ChartSeriesSchemaFactory.createTimeSeriesForClass(
  CHART_SERIES_HABIT_VALUE.id,
  HabitValueChartSeriesConfig
);
