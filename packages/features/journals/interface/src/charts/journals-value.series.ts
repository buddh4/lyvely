import { Exclude, Expose } from 'class-transformer';
import { IChartSeriesDefinition, TIME_SERIES_CHART } from '@lyvely/analytics-interface';
import { TimeSeriesValueChartConfigModel } from '@lyvely/time-series-interface';

@Exclude()
export class JournalValueSeriesConfigModel<
  TID = string,
> extends TimeSeriesValueChartConfigModel<TID> {
  @Expose()
  override readonly type = CHART_SERIES_JOURNAL_VALUE.id;
}

export const CHART_SERIES_JOURNAL_VALUE: IChartSeriesDefinition = {
  id: 'journal-value',
  configType: JournalValueSeriesConfigModel,
  categoryTypes: [TIME_SERIES_CHART.id],
} as const;
