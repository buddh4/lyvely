import {
  IChartCategoryDefinition,
  registerChartCategories as registerCategories,
} from '@lyvely/analytics-interface';
import type { ComponentRegistration } from '@lyvely/ui';

/**
 * Interface representing the definition of a chart used in the frontend.
 *
 * @template TConfigType - The type of the chart configuration.
 */
export interface IWebChartCategoryDefinition {
  /** The chart series type definition. **/
  type: IChartCategoryDefinition;

  /** A translatable label. **/
  label: string;

  /** A component used for rendering the chart. **/
  component: ComponentRegistration;

  /** Optional condition check whether this template is active. **/
  condition?(): boolean;
}

const chartCategoryWebRegistry = new Map<string, IWebChartCategoryDefinition>();

export function registerChartCategories(definition: IWebChartCategoryDefinition[]) {
  definition.forEach(registerChartCategory);
}

export function registerChartCategory(definition: IWebChartCategoryDefinition) {
  const { type } = definition;
  chartCategoryWebRegistry.set(type.id, definition);
  registerCategories(definition.type);
}

export function getChartCategoryDefinitions(): Array<IWebChartCategoryDefinition> {
  return Array.from(chartCategoryWebRegistry.values());
}

export function getChartCategoryDefinition(id: string): IWebChartCategoryDefinition | undefined {
  return chartCategoryWebRegistry.get(id);
}
