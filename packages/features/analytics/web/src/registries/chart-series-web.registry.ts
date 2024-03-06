import { ComponentRegistration } from '@lyvely/ui';
import { IChartSeriesDefinition, registerChartSeries } from '@lyvely/analytics-interface';

export interface IChartSeriesFormDefinition {
  type: IChartSeriesDefinition;
  label: string;
  form?: ComponentRegistration;
}

const chartSeriesWebRegistry = new Map<string, IChartSeriesFormDefinition>();

export function registerChartSeriesFormDefinition(definition: IChartSeriesFormDefinition) {
  const { type } = definition;
  chartSeriesWebRegistry.set(type.id, definition);
  registerChartSeries(definition.type);
}

export function getChartSeriesFormDefinitions(): Array<IChartSeriesFormDefinition> {
  return Array.from(chartSeriesWebRegistry.values());
}

export function getChartSeriesFormDefinition(key: string): IChartSeriesFormDefinition | undefined {
  return chartSeriesWebRegistry.get(key);
}
