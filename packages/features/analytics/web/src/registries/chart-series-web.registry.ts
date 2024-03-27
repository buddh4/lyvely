import {
  IChartSeriesDefinition,
  registerChartSeries,
  ChartSeriesConfigModel,
} from '@lyvely/analytics-interface';
import type { ComponentRegistration } from '@lyvely/ui';

/**
 * Interface representing the definition of a chart used in the frontend.
 *
 * @template TConfigType - The type of the chart configuration.
 */
export interface IWebChartDefinition<
  TConfigType extends ChartSeriesConfigModel = ChartSeriesConfigModel,
> {
  /** The chart series type definition. **/
  type: IChartSeriesDefinition<TConfigType>;

  /** A translatable label. **/
  label: string;

  /** A translatable description. **/
  description?: string;

  /** An optional form component for chart specific settings. **/
  form?: ComponentRegistration;

  /** Optional config model initializer. As default the chart definition constructor is used (if any) **/
  initModel?(): TConfigType;

  /** Optional condition check whether this template is active. **/
  condition?(): boolean;
}

const chartSeriesWebRegistry = new Map<string, IWebChartDefinition>();

export function registerCharts(definition: IWebChartDefinition[]) {
  definition.forEach((d) => registerChart(d));
}

export function registerChart(definition: IWebChartDefinition) {
  const { type } = definition;
  chartSeriesWebRegistry.set(type.id, definition);
  registerChartSeries(definition.type);
}

export function getChartDefinitions(): Array<IWebChartDefinition> {
  return Array.from(chartSeriesWebRegistry.values());
}

export function getChartDefinition(id: string): IWebChartDefinition | undefined {
  return chartSeriesWebRegistry.get(id);
}
