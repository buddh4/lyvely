import { Component } from 'vue';
import { ContentModel, registerContentModelType, CreateContentModel } from '@lyvely/interface';
import {
  IContentTypeOptions,
  IStreamEntryProps,
  IContentDetailsProps,
  ICreateContentModalProps,
  IEditContentModalProps,
  type IEditOrCreateModalProps,
} from '../interfaces';
import { resolveComponentRegistration, ComponentRegistration } from '@lyvely/ui';
import type { Type } from '@lyvely/common';
import { getModule } from '@/core';

const streamEntryRegistry = new Map<string, Component<IStreamEntryProps>>();
const contentDetailRegistry = new Map<string, Component<IContentDetailsProps>>();
const createContentModalRegistry = new Map<string, Component<IEditOrCreateModalProps>>();
const editContentModalRegistry = new Map<string, Component<IEditOrCreateModalProps>>();
const contentTypeOptionsRegistry = new Map<string, IContentTypeOptions>();

/**
 * Registers a content type with the provided options.
 *
 * @param {IContentTypeOptions} options - The options for registering the content type.
 * @param {string} options.type - The type of the content type.
 * @param {string[]} options.interfaces - The interfaces to register with the content type.
 * @param {Function} [options.modelClass] - The model class to register with the content type.
 * @param {any} [options.additionalOptions] - Additional options to register with the content type.
 */
export function registerContentType(options: IContentTypeOptions) {
  const { interfaces } = options;

  _registerInterfaces(options.type, interfaces);

  if (options.modelClass) {
    registerContentModelType(options.type, options.modelClass);
  }

  _registerContentTypeOptions(options.type, options);
}

/**
 * Registers interfaces for a content type.
 *
 * @param {string} contentType - The content type to register interfaces for.
 * @param {IContentTypeOptions['interfaces']} [interfaces] - The interfaces to register.
 */
function _registerInterfaces(contentType: string, interfaces?: IContentTypeOptions['interfaces']) {
  if (!interfaces) return;

  if (interfaces.stream?.details) {
    registerContentDetailsComponent(contentType, interfaces.stream.details);
  }

  if (interfaces.stream && 'entry' in interfaces.stream) {
    registerContentStreamEntryComponent(contentType, interfaces.stream.entry);
  }

  if (!interfaces.upsert) return;

  if ('component' in interfaces.upsert) {
    registerCreateContentModalComponent(contentType, interfaces.upsert.component);
    registerEditContentModalComponent(contentType, interfaces.upsert.component);
  }

  if ('editComponent' in interfaces.upsert) {
    registerEditContentModalComponent(contentType, interfaces.upsert.editComponent);
  }

  if ('createComponent' in interfaces.upsert) {
    registerCreateContentModalComponent(contentType, interfaces.upsert.createComponent);
  }
}

/**
 * Registers content type options for a given content type.
 *
 * @param {string} contentType - The content type to register options for.
 * @param {IContentTypeOptions} options - The options to associate with the content type.
 *
 * @return {void}
 */
function _registerContentTypeOptions(contentType: string, options: IContentTypeOptions) {
  contentTypeOptionsRegistry.set(contentType, options);
}

/**
 * Retrieves the content type options for a given content type.
 *
 * @return {IContentTypeOptions | undefined} The options for the specified content type, or undefined if the content type is not found.
 * @param contentOrType
 */
export function getContentTypeOptions(
  contentOrType: string | ContentModel
): IContentTypeOptions | undefined {
  const type = typeof contentOrType === 'string' ? contentOrType : contentOrType.type;
  return contentTypeOptionsRegistry.get(type);
}

/**
 * Returns the create model for a specified content type.
 *
 *
 * @return {Type<CreateContentModel> | undefined} - The create model for the specified content type, or undefined if it is not found.
 * @param contentOrType
 */
export function getContentCreateModel(
  contentOrType: string | ContentModel
): Type<CreateContentModel> | undefined {
  const upsertOptions = getContentTypeOptions(contentOrType)?.interfaces?.upsert;
  if (!upsertOptions || !('createModel' in upsertOptions)) return undefined;
  return upsertOptions.createModel;
}

/**
 * Returns the icon associated with creating a specified content type.
 *
 * @param {string | ContentModel} contentOrType - The content type or content model object.
 *
 * @return {string | undefined} - The icon associated with the specified content type, or undefined if none is found.
 */
export function getContentTypeIcon(contentOrType: string | ContentModel): string | undefined {
  const options = getContentTypeOptions(contentOrType);
  if (!options) return;
  return options.icon || getModule(options.moduleId)?.icon;
}

/**
 * Registers a create content modal component for a specific content type.
 *
 * @param {string} contentType - The content type for which the component is to be registered.
 * @param {ComponentRegistration<ICreateContentModalProps>} component - The component to be registered.
 *
 * @return {void}
 */
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

/**
 * Returns an array of content types that implement the upsert interface for creating content by modal.
 *
 * @returns {Array} An array of content type options.
 */
export function getCreateContentTypes() {
  return Array.from(contentTypeOptionsRegistry.values()).filter(
    (options) => !!createContentModalRegistry.get(options.type)
  );
}

/**
 * Retrieves the component for the create content modal based on the given content or type.
 *
 * @param {string | ContentModel} contentOrType - The content or type to determine the component.
 * @returns {Component<ICreateContentModalProps> | undefined} - The component for the create content modal, or undefined if not found.
 */
export function getCreateContentModalComponent(
  contentOrType: string | ContentModel
): Component<ICreateContentModalProps> | undefined {
  const type = typeof contentOrType === 'string' ? contentOrType : contentOrType.type;
  return createContentModalRegistry.get(type);
}

/**
 * Registers a modal component for editing the given content type.
 *
 * @param {string} contentType - The type of content to register the modal component for.
 * @param {ComponentRegistration<IEditContentModalProps | IEditOrCreateModalProps>} component - The modal component to register.
 *
 * @return {void}
 */
export function registerEditContentModalComponent(
  contentType: string,
  component: ComponentRegistration<IEditContentModalProps | IEditOrCreateModalProps>
) {
  console.debug(`Register edit content component ${contentType}`);
  editContentModalRegistry.set(contentType, resolveComponentRegistration(component));
}

/**
 * Returns the edit content modal component for the given content or content type.
 *
 * @param {string | ContentModel} contentOrType - The content or content type.
 * @return {Component<IEditContentModalProps | IEditOrCreateModalProps> | undefined} - The edit content modal component, if found. Otherwise, undefined.
 */
export function getEditContentModalComponent(
  contentOrType: string | ContentModel
): Component<IEditContentModalProps | IEditOrCreateModalProps> | undefined {
  const type = typeof contentOrType === 'string' ? contentOrType : contentOrType.type;
  return editContentModalRegistry.get(type);
}

/**
 * Registers a content stream entry component for the provided content type.
 *
 * @param {string} contentType - The content type to register the component for.
 * @param {ComponentRegistration<IStreamEntryProps>} component - The component to register.
 *
 * @return {void}
 */
export function registerContentStreamEntryComponent(
  contentType: string,
  component: ComponentRegistration<IStreamEntryProps>
) {
  console.debug(`Register content component ${contentType}`);
  streamEntryRegistry.set(contentType, resolveComponentRegistration(component));
}

/**
 * Retrieves the component associated with a given content or content type.
 *
 * @param {string | ContentModel} contentOrType - The content or type to retrieve the component for.
 * @return {Component<IStreamEntryProps> | undefined} - The component associated with the content or type, or undefined if not found.
 */
export function getContentStreamEntryComponent(
  contentOrType: string | ContentModel
): Component<IStreamEntryProps> | undefined {
  const type = typeof contentOrType === 'string' ? contentOrType : contentOrType.type;
  return streamEntryRegistry.get(type);
}

/**
 * Registers a content details component for a specific content type.
 *
 * @param {string} contentType - The type of content that the component is registered for.
 * @param {ComponentRegistration<IContentDetailsProps>} component - The component registration object.
 * @return {void}
 */
export function registerContentDetailsComponent(
  contentType: string,
  component: ComponentRegistration<IContentDetailsProps>
) {
  console.debug(`Register content detail component ${contentType}`);
  contentDetailRegistry.set(contentType, resolveComponentRegistration(component));
}

/**
 * Gets the content details component based on the provided content or content type.
 *
 * @param {string | ContentModel} contentOrType - The content or content type.
 * @returns {Component<IContentDetailsProps> | undefined} - The content details component if found, otherwise undefined.
 */
export function getContentDetailsComponent(
  contentOrType: string | ContentModel
): Component<IContentDetailsProps> | undefined {
  // Todo: maybe provide a fallback component type
  const type = typeof contentOrType === 'string' ? contentOrType : contentOrType.type;
  return contentDetailRegistry.get(type);
}
