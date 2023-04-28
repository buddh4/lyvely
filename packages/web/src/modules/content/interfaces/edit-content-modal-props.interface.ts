import { ContentModel } from '@lyvely/common';

export interface ICreateContentModalProps {
  type: string;
  modelValue: boolean;
  initOptions?: any;
}

export interface IEditContentModalProps<T extends ContentModel = ContentModel>
  extends ICreateContentModalProps {
  content: T;
}

export interface IEditOrCreateModalProps<T extends ContentModel = ContentModel> {
  type: string;
  modelValue: boolean;
  initOptions?: ICreateContentInitOptions;
  content?: T;
}

export type ICreateContentInitOptions = {
  parent?: string;
  tagNames?: string[];
  title?: string;
  text?: string;
} & any;
