import { ComponentRegistration } from '@lyvely/ui';
import { IGraphType, registerGraphType } from '@lyvely/analytics-interface';

export interface IGraphTypeDefinition extends IGraphType {
  label: string;
  form?: ComponentRegistration;
}

const graphTypeDefinitionRegistry = new Map<string, IGraphTypeDefinition>();

export function registerGraphTypeDefinition(graphType: IGraphTypeDefinition) {
  graphTypeDefinitionRegistry.set(graphType.value, graphType);
  registerGraphType(graphType);
}

export function getGraphTypeDefinitions(): Array<IGraphTypeDefinition> {
  return Array.from(graphTypeDefinitionRegistry.values());
}

export function getGraphTypeDefinition(key: string) {
  return graphTypeDefinitionRegistry.get(key);
}
