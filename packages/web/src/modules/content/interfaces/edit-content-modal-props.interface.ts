import { ContentModel } from '@lyvely/common';
import { IStream } from '@/modules/stream/composables/stream.composable';

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
  initOptions?: any;
  content?: T;
}
