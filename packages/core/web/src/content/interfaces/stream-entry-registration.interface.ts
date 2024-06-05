import { IStreamEntryProps } from './stream-entry-props.interface';
import { IContentDetailsProps } from './content-details-props.interface';
import { type IEditOrCreateModalProps } from './edit-content-modal-props.interface';
import { Type } from '@lyvely/common';
import { ContentModel, CreateContentModel, IContentTypeMeta } from '@lyvely/interface';
import { RouteLocationRaw } from 'vue-router';
import { ComponentRegistration, Translatable } from '@lyvely/ui';

/**
 * When using the default stream entry component without overwriting it by a custom component, these options
 * are passed to the default stream entry component.
 */
export interface IDefaultStreamEntryOptions {
  entryOptions?: {
    /**  Affects the stream entry layout when using the default the stream entry. (default: block) **/
    layout?: StreamEntryLayout;
    /**  Sets an icon used if the layout does not equal message layout. (default: module icon) **/
    icon?: string;
    /** Overwrites the class of the icon. **/
    iconClass?: string;
    /** Whether to omit tags in the layout. **/
    omitTags?: boolean;
    /** Whether this content type supports merging of stream entries. (default: true) **/
    merge?: boolean;
  };
}

/**
 * This option overwrites the default stream entry component.
 */
export interface ICustomStreamEntryOptions {
  entry: ComponentRegistration<IStreamEntryProps>;
}

/**
 * Represents the options for configuring the content type stream components.
 *
 * @interface
 */
export interface IContentDetailsOptions {
  /** Overwrites the default ContentStreamEntryDetails component. **/
  details?: ComponentRegistration<IContentDetailsProps>;
}

/**
 * Defines the layout of the default stream entry.
 */
export enum StreamEntryLayout {
  Message = 'message',
  Block = 'block',
}

/**
 * Represents the options used to create a content type.
 */
export interface IContentTypeCreateModalOptions {
  createModel: Type<CreateContentModel>;
  createComponent: ComponentRegistration<IEditOrCreateModalProps>;
}

/**
 * Interface representing options for creating a content type route.
 * @interface
 */
export interface IContentTypeUpsertRouteOptions {
  upsertRoute: RouteLocationRaw;
}

/**
 * Interface representing options for editing a content type.
 */
export interface IContentTypeModalOptions {
  createModel: Type<CreateContentModel>;
  createComponent: ComponentRegistration<IEditOrCreateModalProps>;
  editComponent: ComponentRegistration<IEditOrCreateModalProps>;
}

/**
 * Represents the options for configuring the content type upsert components.
 *
 * @interface
 */
export interface IContentTypeUpsertModalOptions {
  createModel: Type<CreateContentModel>;
  component: ComponentRegistration<IEditOrCreateModalProps>;
}

/**
 * This interface is used to register new content types in the frontend and contains information of
 * how to display a content type and provides basic information about a content type.
 */
export interface IContentTypeOptions {
  /** The content type discriminator. **/
  type: string;
  /** The related module id. **/
  moduleId: string;
  /** A translatable name of the content used in the ui. **/
  name: Translatable;
  /** The related main feature of the content. **/
  feature?: string;
  /** An optional icon, used for example for stream entries with non message layout, if not defined, the module icon will be used. **/
  icon?: string;
  /** The home route of this content type, if any. **/
  route?: RouteLocationRaw;
  /** The content model class, used e.g. for auto transformation of stream responses. **/
  modelClass: Type<ContentModel>;
  /** The content type metadata, holds general content type related information and potential restrictions. **/
  meta?: IContentTypeMeta;
  /**
   * Interfaces implemented by this content type, this can be used to register content type specific components and settings.
   * External modules may extend this by supporting other interfaces.
   **/
  interfaces?: {
    /** Can be used to overwrite the default stream component for this content type. **/
    stream?: (IDefaultStreamEntryOptions | ICustomStreamEntryOptions) & IContentDetailsOptions;
    /** Can be used to set components for creating and/or updating of this content type. **/
    upsert?:
      | IContentTypeUpsertRouteOptions
      | IContentTypeModalOptions
      | IContentTypeUpsertModalOptions
      | false;
  } & Record<string, unknown>;
}
