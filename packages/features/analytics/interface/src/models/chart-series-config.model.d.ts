import { type BaseModelData } from '@lyvely/common';
import { IChartSeriesConfig } from '../interfaces';
export declare class ChartSeriesConfigModel implements IChartSeriesConfig {
    id: string;
    type: string;
    name: string;
    constructor(data: BaseModelData<ChartSeriesConfigModel>);
}
