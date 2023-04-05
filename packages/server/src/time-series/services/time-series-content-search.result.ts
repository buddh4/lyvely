import { TimeSeriesContent, DataPoint } from '../schemas';

export interface ITimeSeriesContentSearchResult<
  TModel extends TimeSeriesContent,
  TDataPointModel extends DataPoint = DataPoint,
> {
  models: TModel[];
  dataPoints?: TDataPointModel[];
}
