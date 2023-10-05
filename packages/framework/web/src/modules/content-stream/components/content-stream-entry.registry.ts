import { Component, defineAsyncComponent } from 'vue';
import { Lazy, Type } from '@lyvely/common';
import { ContentModel } from '@lyvely/content-interface';
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
const streamEntryRegistry = new Map<string, Component<IStreamEntryProps>>();
const contentDetailRegistry = new Map<string, Component<IContentDetailsProps>>();
const createContentModalRegistry = new Map<string, Component<ICreateContentModalProps>>();
const editContentModalRegistry = new Map<string, Component<IEditContentModalProps>>();
const contentTypeOptionsRegistry = new Map<string, IContentTypeOptions>();

export function registerContentType(options: IContentTypeOptions) {
  const { interfaces } = options;

  _registerInterfaces(options.type, interfaces);

  if (options.modelClass) {
    _registerContentType(options.type, options.modelClass);
  }

  _registerContentTypeOptions(options.type, options);
}

function _registerInterfaces(contentType: string, interfaces?: IContentTypeOptions['interfaces']) {
  if (!interfaces) return;

  if (interfaces.stream?.details) {
    registerContentDetailsComponent(contentType, interfaces.stream.details);
  }

  if (
    interfaces.create !== false &&
    interfaces.create?.mode === 'modal' &&
    interfaces.create.component
  ) {
    registerCreateContentModalComponent(contentType, interfaces.create.component);
  }

  if (interfaces.edit !== false && interfaces.edit?.mode === 'modal' && interfaces.edit.component) {
    registerEditContentModalComponent(contentType, interfaces.edit.component);
  }

  if (interfaces.stream?.entry) {
    registerContentStreamEntryComponent(contentType, interfaces.stream.entry);
  }
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

export function getCreateContentTypes() {
  return Array.from(contentTypeOptionsRegistry.values()).filter(
    (options) => !!createContentModalRegistry.get(options.type),
  );
}

export function getCreateContentModalComponent(
  contentOrType: string | ContentModel,
): Component<ICreateContentModalProps> | undefined {
  const type = typeof contentOrType === 'string' ? contentOrType : contentOrType.type;
  return createContentModalRegistry.get(type);
}

export function registerEditContentModalComponent(
  contentType: string,
  component: ComponentRegistration<IEditContentModalProps>,
) {
  console.debug(`Register edit content component ${contentType}`);
  editContentModalRegistry.set(contentType, _getComponent(component));
}

export function getEditContentModalComponent(
  contentOrType: string | ContentModel,
): Component<IEditContentModalProps> | undefined {
  const type = typeof contentOrType === 'string' ? contentOrType : contentOrType.type;
  return editContentModalRegistry.get(type);
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
): Component<IStreamEntryProps> {
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
): ComponentRegistration<IContentDetailsProps> {
  // Todo: maybe provide a fallback component type
  const type = typeof contentOrType === 'string' ? contentOrType : contentOrType.type;
  return contentDetailRegistry.get(type) || ContentDetails;
}
