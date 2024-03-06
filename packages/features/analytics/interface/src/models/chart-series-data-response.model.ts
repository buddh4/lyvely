import { ChartSeriesData } from '../interfaces';
import { Expose } from 'class-transformer';

@Expose()
export class ChartSeriesDataResponse<TData extends ChartSeriesData<any> = ChartSeriesData<any>> {
  result: Array<TData>;

  constructor(result: Array<TData> = []) {
    this.result = result;
  }
}
