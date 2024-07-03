import {
  ContentModel,
  ISortable,
  ContentDataTypeModel,
  UserAssignmentStrategy,
} from '@lyvely/interface';
import { PropertyType } from '@lyvely/common';
import {
  type ITimeSeriesContent,
  ITimeSeriesContentConfig,
  type ITimeSeriesState,
  type ITimeSeriesSummary,
  type ITimeSeriesSummaryWindowEntry,
} from '../interfaces';
import { Expose } from 'class-transformer';
import { ICalendarPlanEntry } from '@lyvely/calendar-plan-interface';
import { CalendarInterval } from '@lyvely/dates';
import { BaseModel, type BaseModelData } from '@lyvely/common';

export class TimeSeriesSummaryWindowEntryModel implements ITimeSeriesSummaryWindowEntry {
  @Expose()
  tid: string;
  @Expose()
  value: number;
}

export class TimeSeriesSummaryModel<TID = string> implements ITimeSeriesSummary<TID> {
  @Expose()
  uid: TID | null;

  @Expose()
  @PropertyType([TimeSeriesSummaryWindowEntryModel])
  window: TimeSeriesSummaryWindowEntryModel[];
}

export class TimeSeriesStateModel<TID = string> implements ITimeSeriesState<TID> {
  @Expose()
  @PropertyType([TimeSeriesSummaryModel])
  summaries: TimeSeriesSummaryModel<TID>[];
}

@Expose()
export class TimeSeriesContentModel<
    TID = string,
    TConfig extends ITimeSeriesContentConfig = ITimeSeriesContentConfig,
    TState extends TimeSeriesStateModel<TID> = TimeSeriesStateModel<TID>,
    TData extends ContentDataTypeModel = ContentDataTypeModel,
  >
  extends ContentModel<TID, TConfig, TState, TData>
  implements ISortable, ICalendarPlanEntry<TID>, ITimeSeriesContent<TID, TConfig, TState, TData>
{
  constructor(
    data?: BaseModelData<TimeSeriesContentModel<TID, TConfig, TState, TData>>,
    uid?: string
  ) {
    super(false);
    BaseModel.init(this, data);
    this.state.summaries = this.state.summaries.filter(
      (summary) => summary.uid === null || summary.uid?.toString() === uid
    );
  }

  getSummary(uid?: string) {
    return this.timeSeriesConfig.userStrategy === UserAssignmentStrategy.PerUser
      ? this.state.summaries.find((s) => s.uid?.toString() === uid)
      : this.state.summaries.find((s) => s.uid === null);
  }

  get interval(): CalendarInterval {
    return this.timeSeriesConfig.interval;
  }

  set interval(interval: CalendarInterval) {
    this.timeSeriesConfig.interval = interval;
  }

  get timeSeriesConfig(): TConfig['timeSeries'] {
    return this.config.timeSeries;
  }

  set timeSeriesConfig(config: TConfig['timeSeries']) {
    this.config.timeSeries = config;
  }
}
