import { TimeSeriesContent, DataPoint } from '../schemas';
import { UpdateQuerySet, OptionalUser } from '@lyvely/api';
import { CalendarDate } from '@lyvely/dates';

export interface IDataPointProcessorStrategy<
  TModel extends TimeSeriesContent = TimeSeriesContent,
  TDataPoint extends DataPoint = DataPoint,
> {
  postProcess(
    user: OptionalUser,
    model: TModel,
    dataPoint: TDataPoint,
    updateDate: CalendarDate,
  ): UpdateQuerySet<TDataPoint> | false;
}
