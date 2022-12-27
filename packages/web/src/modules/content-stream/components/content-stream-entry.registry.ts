import { Component } from 'vue';
import { ContentModel } from '@lyvely/common';
import ContentDetails from '@/modules/content-stream/components/ContentDetails.vue';
import ContentStreamEntry from '@/modules/content-stream/components/ContentStreamEntry.vue';

const streamEntryRegistry = new Map<string, Component>();
const contentDetailRegistry = new Map<string, Component>();

export function registerContentStreamEntryComponent(contentType: string, component: Component) {
  console.debug(`Register content component ${contentType}`);
  streamEntryRegistry.set(contentType, component);
}

export function getContentStreamEntryComponent(contentOrType: string | ContentModel) {
  // Todo: maybe provide a fallback component type
  const type = typeof contentOrType === 'string' ? contentOrType : contentOrType.type;
  return streamEntryRegistry.get(type) || ContentStreamEntry;
}

export function registerContentDetailsComponent(contentType: string, component: Component) {
  console.debug(`Register content details component ${contentType}`);
  contentDetailRegistry.set(contentType, component);
}

export function getContentDetailsComponent(contentOrType: string | ContentModel) {
  // Todo: maybe provide a fallback component type
  const type = typeof contentOrType === 'string' ? contentOrType : contentOrType.type;
  return contentDetailRegistry.get(type) || ContentDetails;
}
