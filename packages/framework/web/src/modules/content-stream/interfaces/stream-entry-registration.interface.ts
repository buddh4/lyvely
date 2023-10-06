import { Component } from 'vue';
import { IStreamEntryProps } from './stream-entry-props.interface';
import { IContentDetailsProps } from './content-details-props.interface';
import { Lazy, Type } from '@lyvely/common';
import { ContentModel, CreateContentModel } from '@lyvely/content-interface';
import { RouteLocationRaw } from 'vue-router';
import {
  ICreateContentModalProps,
  IEditContentModalProps,
} from '@/modules/content/interfaces/edit-content-modal-props.interface';

export type ComponentRegistration<Props> = Component<Props> | Lazy<Component<Props>>;

export type ModalEdit = {
  mode: 'modal';
  component: ComponentRegistration<IEditContentModalProps>;
};

export type ModalCreate = {
  mode: 'modal';
  component: ComponentRegistration<ICreateContentModalProps>;
  modelClass: Type<CreateContentModel>;
};

export type RouteEdit = {
  mode: 'route';
  route: RouteLocationRaw;
};

export interface IContentTypeMeta {
  archivable?: boolean;
  editable?: boolean;
  reactable?: boolean;
  commentable?: boolean;
}

export interface IContentTypeStreamOptions {
  entry?: ComponentRegistration<IStreamEntryProps>;
  details?: ComponentRegistration<IContentDetailsProps>;
}

export interface IContentTypeOptions {
  type: string;
  name: string | (() => string);
  feature: string;
  icon?: string;
  modelClass: Type<ContentModel>;
  meta?: IContentTypeMeta;
  interfaces?: {
    stream?: IContentTypeStreamOptions;
    create?: ModalCreate | RouteEdit | false;
    edit?: ModalEdit | RouteEdit | false;
  };
}