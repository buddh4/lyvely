import { TimeSeriesContent, DataPoint } from '../schemas';
import { User, UpdateQuerySet } from '@lyvely/core';

export interface IDataPointProcessorStrategy<
  TModel extends TimeSeriesContent<TModel> = TimeSeriesContent<any>,
  TDataPoint extends DataPoint = DataPoint,
> {
  postProcess(user: User, model: TModel, dataPoint: TDataPoint): UpdateQuerySet<TDataPoint> | false;
}
