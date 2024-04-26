import { IChartCategoryDefinition } from '../interfaces';

const chartCategoryRegistry = new Map<string, IChartCategoryDefinition>();

export function registerChartCategories(...definitions: IChartCategoryDefinition[]) {
  definitions.forEach((d) => registerChartCategoryDefinition(d));
}

function registerChartCategoryDefinition(definition: IChartCategoryDefinition) {
  chartCategoryRegistry.set(definition.id, definition);
}

export function getChartCategoryDefinitions(): Array<IChartCategoryDefinition> {
  return Array.from(chartCategoryRegistry.values());
}

export function getChartCategoryDefinition(id: string) {
  return chartCategoryRegistry.get(id);
}
