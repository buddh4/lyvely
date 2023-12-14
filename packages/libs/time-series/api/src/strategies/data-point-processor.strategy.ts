import { TimeSeriesContent, DataPoint } from '../schemas';
import { UpdateQuerySet, OptionalUser } from '@lyvely/api';

export interface IDataPointProcessorStrategy<
  TModel extends TimeSeriesContent<TModel> = TimeSeriesContent<any>,
  TDataPoint extends DataPoint = DataPoint,
> {
  postProcess(
    user: OptionalUser,
    model: TModel,
    dataPoint: TDataPoint,
  ): UpdateQuerySet<TDataPoint> | false;
}
