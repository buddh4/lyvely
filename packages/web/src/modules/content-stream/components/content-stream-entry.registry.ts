import { Component, defineAsyncComponent } from 'vue';
import { ContentModel, Lazy, Type } from '@lyvely/common';
import ContentDetails from '@/modules/content-stream/components/ContentDetails.vue';
import {
  ComponentRegistration,
  IContentTypeOptions,
} from '@/modules/content-stream/interfaces/stream-entry-registration.interface';
import { IStreamEntryProps } from '@/modules/content-stream/interfaces/stream-entry-props.interface';
import { IContentDetailsProps } from '@/modules/content-stream/interfaces/content-details-props.interface';
import DefaultStreamEntry from '@/modules/content-stream/components/DefaultStreamEntry.vue';
import {
  ICreateContentModalProps,
  IEditContentModalProps,
} from '@/modules/content/interfaces/edit-content-modal-props.interface';

const contentTypeRegistry = new Map<string, Type<ContentModel>>();
const streamEntryRegistry = new Map<string, Component>();
const contentDetailRegistry = new Map<string, Component>();
const createContentModalRegistry = new Map<string, Component>();
const editContentModalRegistry = new Map<string, Component>();
const contentTypeOptionsRegistry = new Map<string, IContentTypeOptions>();

export function registerContentType(options: IContentTypeOptions) {
  if (options.stream?.details) {
    registerContentDetailsComponent(options.type, options.stream.details);
  }

  if (options.create?.mode === 'modal' && options.create.component) {
    registerCreateContentModalComponent(options.type, options.create.component);
  }

  if (options.edit?.mode === 'modal' && options.edit.component) {
    registerEditContentModalComponent(options.type, options.edit.component);
  }

  if (options.stream?.streamEntry) {
    registerContentStreamEntryComponent(options.type, options.stream.streamEntry);
  }

  if (options.modelClass) {
    _registerContentType(options.type, options.modelClass);
  }

  _registerContentTypeOptions(options.type, options);
}

function _registerContentTypeOptions(contentType: string, options: IContentTypeOptions) {
  contentTypeOptionsRegistry.set(contentType, options);
}

export function getContentTypeOptions(contentType: string) {
  return contentTypeOptionsRegistry.get(contentType);
}

function _registerContentType(type: string, modelType: Type<ContentModel>) {
  contentTypeRegistry.set(type, modelType);
}

export function getContentType(type: string) {
  return contentTypeRegistry.get(type);
}

export function registerCreateContentModalComponent(
  contentType: string,
  component: ComponentRegistration<ICreateContentModalProps>,
) {
  console.debug(`Register create content component ${contentType}`);
  createContentModalRegistry.set(contentType, _getComponent(component));
}

export function getCreateContentModalComponent(contentType: string) {
  return createContentModalRegistry.get(contentType);
}

export function registerEditContentModalComponent(
  contentType: string,
  component: ComponentRegistration<IEditContentModalProps>,
) {
  console.debug(`Register edit content component ${contentType}`);
  editContentModalRegistry.set(contentType, _getComponent(component));
}

export function getEditContentModalComponent(contentType: string) {
  return editContentModalRegistry.get(contentType);
}

export function registerContentStreamEntryComponent(
  contentType: string,
  component: ComponentRegistration<IStreamEntryProps>,
) {
  console.debug(`Register content component ${contentType}`);
  streamEntryRegistry.set(contentType, _getComponent(component));
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
  console.debug(`Register content detail component ${contentType}`);
  contentDetailRegistry.set(contentType, _getComponent(component));
}

function _getComponent(component: ComponentRegistration<any>) {
  return typeof component === 'function'
    ? defineAsyncComponent(component as Lazy<Component>)
    : component;
}

export function getContentDetailsComponent(
  contentOrType: string | ContentModel,
): Component<IContentDetailsProps> | Lazy<Component<IContentDetailsProps>> {
  // Todo: maybe provide a fallback component type
  const type = typeof contentOrType === 'string' ? contentOrType : contentOrType.type;
  return contentDetailRegistry.get(type) || ContentDetails;
}
