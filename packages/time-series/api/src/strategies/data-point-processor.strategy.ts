import { TimeSeriesContent, DataPoint } from '../schemas';
import { UpdateQuerySet } from '@lyvely/core';
import { User } from '@lyvely/users';

export interface IDataPointProcessorStrategy<
  TModel extends TimeSeriesContent<TModel> = TimeSeriesContent<any>,
  TDataPoint extends DataPoint = DataPoint,
> {
  postProcess(user: User, model: TModel, dataPoint: TDataPoint): UpdateQuerySet<TDataPoint> | false;
}