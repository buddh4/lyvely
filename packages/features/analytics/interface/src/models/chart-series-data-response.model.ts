import { ChartSeriesData } from '../interfaces';
import { Expose } from 'class-transformer';

@Expose()
export class ChartSeriesDataResponse<TData extends ChartSeriesData = ChartSeriesData> {
  result: Map<string, Array<TData>>;

  constructor(result: Map<string, Array<TData>>) {
    this.result = result || new Map();
  }
}
