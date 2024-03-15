import { IChartSeriesDefinition } from '../interfaces';
import { Type } from '@lyvely/common';
export declare function registerChartSeries(definition: IChartSeriesDefinition): void;
export declare function getChartSeriesConfigTypes(): {
    value: Type;
    name: string;
}[];
export declare function getChartSeriesDefinitions(): Array<IChartSeriesDefinition>;
export declare function getChartSeriesDefinition(id: string): IChartSeriesDefinition | undefined;
export declare function resetChartSeries(): void;
