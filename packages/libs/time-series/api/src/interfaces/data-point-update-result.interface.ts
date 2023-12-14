import { IDataPoint } from '@lyvely/time-series-interface';

/**
 * Represents the result of updating a data point.
 *
 * @template TDataPointModel The type of the data point model.
 */
export interface IDataPointUpdateResult<TDataPointModel extends IDataPoint> {
  dataPoint: TDataPointModel;
  oldValue?: TDataPointModel['value'];
  isNew: boolean;
}
