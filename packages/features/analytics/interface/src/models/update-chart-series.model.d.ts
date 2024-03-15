import { ChartSeriesConfigModel } from './chart-series-config.model';
export declare class UpdateChartSeriesModel<TConfig extends ChartSeriesConfigModel = ChartSeriesConfigModel> {
    config: TConfig;
    constructor(config: ChartSeriesConfigModel);
}
