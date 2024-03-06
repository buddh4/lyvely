import { IChartSeriesDefinition } from '../interfaces';
import { findAndReplace, Type } from '@lyvely/common';
import { ChartSeriesConfigModel } from '../models/chart-series-config.model';

const chartSeriesRegistry = new Map<string, IChartSeriesDefinition>();
const chartSeriesConfigTypes: Array<{ value: Type; name: string }> = [];

export function registerChartSeries(definition: IChartSeriesDefinition) {
  const { id, configType } = definition;
  chartSeriesRegistry.set(id, definition);
  findAndReplace(
    chartSeriesConfigTypes,
    { name: id, value: configType || ChartSeriesConfigModel },
    'name',
    true,
  );
}

export function getChartSeriesConfigTypes(): { value: Type; name: string }[] {
  return chartSeriesConfigTypes;
}

export function getChartSeriesDefinitions(): Array<IChartSeriesDefinition> {
  return Array.from(chartSeriesRegistry.values());
}

export function getChartSeriesDefinition(id: string) {
  return chartSeriesRegistry.get(id);
}

export function resetChartSeries() {
  chartSeriesRegistry.clear();
  // We need to splice, since we do not want to lose the array instance, which is used for transforms
  chartSeriesConfigTypes.splice(0, chartSeriesConfigTypes.length);
}
