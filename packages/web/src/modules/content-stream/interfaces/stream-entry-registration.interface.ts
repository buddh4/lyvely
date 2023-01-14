import { Component } from 'vue';
import { IStreamEntryProps } from './stream-entry-props.interface';
import { IContentDetailsProps } from './content-details-props.interface';
import { ContentModel, Lazy, Type } from '@lyvely/common';
import { RouteLocationRaw } from 'vue-router';

export enum EditMode {
  Modal = 'modal',
  Route = 'route',
}

export type ComponentRegistration<Props> = Component<Props> | Lazy<Component<Props>>;

export type ModalEdit = {
  mode: EditMode.Modal;
  component: ComponentRegistration<IStreamEntryProps>;
};

export type RouteEdit = {
  mode: EditMode.Route;
  route: RouteLocationRaw;
};

export interface IContentTypeMeta {
  archivable?: boolean;
  editable?: boolean;
  reactable?: boolean;
  commentable?: boolean;
}

export interface IContentTypeStreamOptions {
  streamEntry?: ComponentRegistration<IStreamEntryProps>;
  details?: ComponentRegistration<IContentDetailsProps>;
}

export interface IContentTypeOptions {
  type: string;
  name: string | (() => string);
  feature: string;
  icon?: string;
  modelClass: Type<ContentModel>;
  meta?: IContentTypeMeta;
  stream?: IContentTypeStreamOptions;
  edit?: ModalEdit | RouteEdit;
}
