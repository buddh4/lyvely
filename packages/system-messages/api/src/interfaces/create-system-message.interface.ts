import { CreateContentModel } from '@lyvely/common';

export interface ICreateSystemMessage extends CreateContentModel {
  text: string;
  title?: string;
  params?: Record<string, string>;
}
