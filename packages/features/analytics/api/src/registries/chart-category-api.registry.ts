import {
  IChartCategoryDefinition,
  registerChartCategories as registerCategories,
} from '@lyvely/analytics-interface';
import type { Type } from '@lyvely/api';
import { ChartConfig } from '../schemas';

/**
 * Interface representing the definition of a chart used in the frontend.
 *
 * @template TConfigType - The type of the chart configuration.
 */
export interface IApiChartCategoryDefinition {
  /** The chart series type definition. **/
  type: IChartCategoryDefinition;

  /** A chart config schema model. **/
  configModel?: Type<ChartConfig>;
}

const chartCategoryApiRegistry = new Map<string, IApiChartCategoryDefinition>();

export function registerChartCategories(definition: IApiChartCategoryDefinition[]) {
  definition.forEach(registerChartCategory);
}

export function registerChartCategory(definition: IApiChartCategoryDefinition) {
  const { type } = definition;
  chartCategoryApiRegistry.set(type.id, definition);
  registerCategories(definition.type);
}

export function getChartCategoryDefinitions(): Array<IApiChartCategoryDefinition> {
  return Array.from(chartCategoryApiRegistry.values());
}

export function getChartCategoryDefinition(id: string): IApiChartCategoryDefinition | undefined {
  return chartCategoryApiRegistry.get(id);
}
