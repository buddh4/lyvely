import { Component } from 'vue';
import { ContentModel } from '@lyvely/common';

const registry = new Map<string, Component>();

export function registerContentStreamEntryComponent(contentType: string, component: Component) {
  console.debug(`Register content component ${contentType}`);
  registry.set(contentType, component);
}

export function getContentStreamEntryComponent(contentOrType: string | ContentModel) {
  // Todo: maybe provide a fallback component type
  const type = typeof contentOrType === 'string' ? contentOrType : contentOrType.type;
  return registry.get(type);
}
