import { TimeSeriesContent, DataPoint } from '../schemas';
import { UpdateQuerySet } from '@/core';
import { User } from '@/users';

export interface IDataPointProcessorStrategy<
  TModel extends TimeSeriesContent = TimeSeriesContent,
  TDataPoint extends DataPoint = DataPoint,
> {
  postProcess(user: User, model: TModel, dataPoint: TDataPoint): UpdateQuerySet<TDataPoint> | false;
}
