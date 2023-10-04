import { CreateContentModel } from '@lyvely/content';

export interface ICreateSystemMessage extends CreateContentModel {
  text: string;
  title?: string;
  params?: Record<string, string>;
}
