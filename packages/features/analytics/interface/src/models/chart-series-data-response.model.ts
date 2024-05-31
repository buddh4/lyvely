import { ChartSeriesData, IChartSeriesDataResponse } from '../interfaces';
import { Expose } from 'class-transformer';

@Expose()
export class ChartSeriesDataResponse<TData extends ChartSeriesData = ChartSeriesData>
  implements IChartSeriesDataResponse<TData>
{
  result: Record<string, Array<TData>>;

  constructor(result: Record<string, Array<TData>>) {
    this.result = result || {};
  }
}
