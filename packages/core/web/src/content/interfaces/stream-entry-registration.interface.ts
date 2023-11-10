import { Component } from 'vue';
import { IStreamEntryProps } from './stream-entry-props.interface';
import { IContentDetailsProps } from './content-details-props.interface';
import { Type } from '@lyvely/common';
import { ContentModel, CreateContentModel } from '@lyvely/core-interface';
import { RouteLocationRaw } from 'vue-router';
import {
  ICreateContentModalProps,
  IEditContentModalProps,
} from '@/content/interfaces/edit-content-modal-props.interface';
import { ComponentRegistration } from '@lyvely/ui';

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
  moduleId: string;
  name: string | (() => string);
  feature?: string;
  icon?: string;
  modelClass: Type<ContentModel>;
  meta?: IContentTypeMeta;
  interfaces?: {
    stream?: IContentTypeStreamOptions;
    create?: ModalCreate | RouteEdit | false;
    edit?: ModalEdit | RouteEdit | false;
  };
}
