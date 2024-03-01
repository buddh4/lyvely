import { IGraphType } from '../interfaces';
import { findAndReplace, Type } from '@lyvely/common';

const graphTypeRegistry = new Map<string, IGraphType>();
const graphSeriesConfigTypes: { value: Type; name: string }[] = [];

export function registerGraphType(graphType: IGraphType) {
  graphTypeRegistry.set(graphType.value, graphType);
  if (graphType.model) {
    findAndReplace(
      graphSeriesConfigTypes,
      { value: graphType.model, name: graphType.value },
      'name',
      true,
    );
  }
}

export function getGraphSeriesConfigTypes(): { value: Type; name: string }[] {
  return graphSeriesConfigTypes;
}

export function getGraphTypes(): Array<IGraphType> {
  return Array.from(graphTypeRegistry.values());
}

export function getGraphType(key: string) {
  return graphTypeRegistry.get(key);
}
