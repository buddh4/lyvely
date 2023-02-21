import {
  CalendarIntervalEnum,
  DataPointIntervalFilter,
  DataPointModel,
  SortResult,
  TimeSeriesContentModel,
} from '@lyvely/common';

export interface IMoveEntryEvent {
  cid: string;
  newIndex: number;
  oldIndex: number;
  fromInterval: CalendarIntervalEnum;
  toInterval: CalendarIntervalEnum;
}

export interface CalendarPlanService<
  TModel extends TimeSeriesContentModel,
  TDataPointModel extends DataPointModel = DataPointModel,
> {
  getByRange(
    filter: DataPointIntervalFilter,
  ): Promise<{ models: TModel[]; dataPoints: TDataPointModel[] }>;
  sort(cid: string, interval: CalendarIntervalEnum, attachToId?: string): Promise<SortResult[]>;
}
