import { ChartSeriesData } from '../interfaces';
import { Expose } from 'class-transformer';

@Expose()
export class ChartSeriesDataResponse<TData extends ChartSeriesData = ChartSeriesData> {
  result: Record<string, Array<TData>>;

  constructor(result: Record<string, Array<TData>>) {
    this.result = result || {};
  }
}
