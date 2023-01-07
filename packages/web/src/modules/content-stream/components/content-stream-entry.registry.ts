import { Component } from 'vue';
import { ContentModel, Type } from '@lyvely/common';
import ContentDetails from '@/modules/content-stream/components/ContentDetails.vue';
import ContentStreamEntry from '@/modules/content-stream/components/ContentStreamEntry.vue';
import { IContentTypeOptions } from '@/modules/content-stream/interfaces/stream-entry-registration.interface';

const contentTypeRegistry = new Map<string, Type<ContentModel>>();
const streamEntryRegistry = new Map<string, Component>();
const contentDetailRegistry = new Map<string, Component>();

export function registerContentType(options: IContentTypeOptions) {
  if (options.detailsComponent) {
    registerContentDetailsComponent(options.type, options.detailsComponent);
  }

  if (options.streamEntryComponent) {
    registerContentStreamEntryComponent(options.type, options.streamEntryComponent);
  }

  if (options.modelClass) {
    _registerContentType(options.type, options.modelClass);
  }
}

function _registerContentType(type: string, modelType: Type<ContentModel>) {
  contentTypeRegistry.set(type, modelType);
}

export function getContentType(type: string) {
  return contentTypeRegistry.get(type);
}

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
