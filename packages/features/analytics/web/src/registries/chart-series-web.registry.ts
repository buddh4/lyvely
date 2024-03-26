import {
  ChartType,
  IChartSeriesDefinition,
  registerChartSeries,
} from '@lyvely/analytics-interface';
import type { ComponentRegistration } from '@lyvely/ui';
import { ChartSeriesConfigModel, ChartCategory } from '@lyvely/analytics-interface/src';

export interface IWebChartTemplate<
  TConfigType extends ChartSeriesConfigModel = ChartSeriesConfigModel,
> {
  /** A unique template id, ideally prefixed with the module id, e.g. analytics-user-score. **/
  id: string;

  /** A translatable label. **/
  label: string;

  /** A translatable description. **/
  description?: string;

  /** Optional config model initializer. As default the chart definition constructor is used (if any) **/
  initModel?(): TConfigType;

  /** Optional condition check whether this template is active. **/
  condition?(): boolean;

  /** Optional array of chart types this template supports. As default the chart definition chartTypes are used. **/
  chartTypes?: ChartType[];
}

/**
 * Interface representing the definition of a chart used in the frontend.
 *
 * @template TConfigType - The type of the chart configuration.
 */
export interface IWebChartDefinition<
  TConfigType extends ChartSeriesConfigModel = ChartSeriesConfigModel,
> {
  type: IChartSeriesDefinition<TConfigType>;
  label: string;
  templates?: IWebChartTemplate<TConfigType>[];
  form?: ComponentRegistration;
}

const chartSeriesWebRegistry = new Map<string, IWebChartDefinition>();

export function registerChart(definition: IWebChartDefinition) {
  const { type } = definition;
  chartSeriesWebRegistry.set(type.id, definition);
  registerChartSeries(definition.type);
}

export function getChartDefinitions(): Array<IWebChartDefinition> {
  return Array.from(chartSeriesWebRegistry.values());
}

export function getChartDefinition(key: string): IWebChartDefinition | undefined {
  return chartSeriesWebRegistry.get(key);
}
