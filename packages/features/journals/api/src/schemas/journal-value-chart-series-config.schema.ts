import { ChartSeriesSchemaFactory } from '@lyvely/analytics';
import { NestedSchema } from '@lyvely/api';
import { type TObjectId } from '@lyvely/api';
import { TimeSeriesValueChartSeriesConfig } from '@lyvely/time-series';
import {
  CHART_SERIES_JOURNAL_VALUE,
  JournalValueSeriesConfigModel,
} from '@lyvely/journals-interface';

@NestedSchema()
export class JournalValueChartSeriesConfig
  extends TimeSeriesValueChartSeriesConfig
  implements JournalValueSeriesConfigModel<TObjectId>
{
  override readonly type = CHART_SERIES_JOURNAL_VALUE.id;
}

ChartSeriesSchemaFactory.createTimeSeriesForClass(
  CHART_SERIES_JOURNAL_VALUE.id,
  JournalValueChartSeriesConfig
);
