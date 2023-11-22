import { CreateContentModel } from '@lyvely/interface';

export interface ICreateSystemMessage extends CreateContentModel {
  text: string;
  title?: string;
  params?: Record<string, string>;
}
