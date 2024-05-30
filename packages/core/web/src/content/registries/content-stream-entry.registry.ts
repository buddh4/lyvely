import { Component } from 'vue';
import { ContentModel, registerContentModelType } from '@lyvely/interface';
import {
  IContentTypeOptions,
  IStreamEntryProps,
  IContentDetailsProps,
  ICreateContentModalProps,
  IEditContentModalProps,
} from '../interfaces';
import { resolveComponentRegistration, ComponentRegistration } from '@lyvely/ui';

const streamEntryRegistry = new Map<string, Component<IStreamEntryProps>>();
const contentDetailRegistry = new Map<string, Component<IContentDetailsProps>>();
const createContentModalRegistry = new Map<string, Component<ICreateContentModalProps>>();
const editContentModalRegistry = new Map<string, Component<IEditContentModalProps>>();
const contentTypeOptionsRegistry = new Map<string, IContentTypeOptions>();

export function registerContentType(options: IContentTypeOptions) {
  const { interfaces } = options;

  _registerInterfaces(options.type, interfaces);

  if (options.modelClass) {
    registerContentModelType(options.type, options.modelClass);
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

export function registerCreateContentModalComponent(
  contentType: string,
  component: ComponentRegistration<ICreateContentModalProps>
) {
  console.debug(`Register create content component ${contentType}`);
  createContentModalRegistry.set(
    contentType,
    resolveComponentRegistration<ICreateContentModalProps>(component)
  );
}

export function getCreateContentTypes() {
  return Array.from(contentTypeOptionsRegistry.values()).filter(
    (options) => !!createContentModalRegistry.get(options.type)
  );
}

export function getCreateContentModalComponent(
  contentOrType: string | ContentModel
): Component<ICreateContentModalProps> | undefined {
  const type = typeof contentOrType === 'string' ? contentOrType : contentOrType.type;
  return createContentModalRegistry.get(type);
}

export function registerEditContentModalComponent(
  contentType: string,
  component: ComponentRegistration<IEditContentModalProps>
) {
  console.debug(`Register edit content component ${contentType}`);
  editContentModalRegistry.set(contentType, resolveComponentRegistration(component));
}

export function getEditContentModalComponent(
  contentOrType: string | ContentModel
): Component<IEditContentModalProps> | undefined {
  const type = typeof contentOrType === 'string' ? contentOrType : contentOrType.type;
  return editContentModalRegistry.get(type);
}

export function registerContentStreamEntryComponent(
  contentType: string,
  component: ComponentRegistration<IStreamEntryProps>
) {
  console.debug(`Register content component ${contentType}`);
  streamEntryRegistry.set(contentType, resolveComponentRegistration(component));
}

export function getContentStreamEntryComponent(
  contentOrType: string | ContentModel
): Component<IStreamEntryProps> | undefined {
  const type = typeof contentOrType === 'string' ? contentOrType : contentOrType.type;
  return streamEntryRegistry.get(type);
}

export function registerContentDetailsComponent(
  contentType: string,
  component: ComponentRegistration<IContentDetailsProps>
) {
  console.debug(`Register content detail component ${contentType}`);
  contentDetailRegistry.set(contentType, resolveComponentRegistration(component));
}

export function getContentDetailsComponent(
  contentOrType: string | ContentModel
): Component<IContentDetailsProps> | undefined {
  // Todo: maybe provide a fallback component type
  const type = typeof contentOrType === 'string' ? contentOrType : contentOrType.type;
  return contentDetailRegistry.get(type);
}
