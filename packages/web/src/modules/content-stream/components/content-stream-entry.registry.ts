import { Component, defineAsyncComponent } from 'vue';
import { ContentModel, Lazy, Type } from '@lyvely/common';
import ContentDetails from '@/modules/content-stream/components/ContentDetails.vue';
import ContentStreamEntry from '@/modules/content-stream/components/ContentStreamEntry.vue';
import {
  ComponentRegistration,
  IContentTypeOptions,
} from '@/modules/content-stream/interfaces/stream-entry-registration.interface';
import { IStreamEntryProps } from '@/modules/content-stream/interfaces/stream-entry-props.interface';
import { IContentDetailsProps } from '@/modules/content-stream/interfaces/content-details-props.interface';
import DefaultStreamEntry from '@/modules/content-stream/components/DefaultStreamEntry.vue';

const contentTypeRegistry = new Map<string, Type<ContentModel>>();
const streamEntryRegistry = new Map<string, Component>();
const contentDetailRegistry = new Map<string, Component>();

export function registerContentType(options: IContentTypeOptions) {
  if (options.stream?.details) {
    registerContentDetailsComponent(options.type, options.stream.details);
  }

  if (options.stream?.streamEntry) {
    registerContentStreamEntryComponent(options.type, options.stream.streamEntry);
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

export function registerContentStreamEntryComponent(
  contentType: string,
  component: ComponentRegistration<IStreamEntryProps>,
) {
  console.debug(`Register content component ${contentType}`);
  streamEntryRegistry.set(
    contentType,
    typeof component === 'function'
      ? defineAsyncComponent(component as Lazy<Component>)
      : component,
  );
}

export function getContentStreamEntryComponent(
  contentOrType: string | ContentModel,
): Component<IStreamEntryProps> | Lazy<Component<IStreamEntryProps>> {
  const type = typeof contentOrType === 'string' ? contentOrType : contentOrType.type;
  return streamEntryRegistry.get(type) || DefaultStreamEntry;
}

export function registerContentDetailsComponent(
  contentType: string,
  component: ComponentRegistration<IContentDetailsProps>,
) {
  console.debug(`Register content details component ${contentType}`);
  contentDetailRegistry.set(
    contentType,
    typeof component === 'function'
      ? defineAsyncComponent(component as Lazy<Component>)
      : component,
  );
}

export function getContentDetailsComponent(
  contentOrType: string | ContentModel,
): Component<IContentDetailsProps> | Lazy<Component<IContentDetailsProps>> {
  // Todo: maybe provide a fallback component type
  const type = typeof contentOrType === 'string' ? contentOrType : contentOrType.type;
  return contentDetailRegistry.get(type) || ContentDetails;
}
