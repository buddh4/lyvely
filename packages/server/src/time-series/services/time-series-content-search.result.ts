import { TimeSeriesContent, DataPoint } from '../schemas';

export interface ITimeSeriesContentSearchResult<
  TModel extends TimeSeriesContent<TModel>,
  TDataPointModel extends DataPoint = DataPoint,
> {
  models: TModel[];
  dataPoints?: TDataPointModel[];
}
