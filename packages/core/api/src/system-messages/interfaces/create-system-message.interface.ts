import { CreateBaseContentModel } from '@lyvely/interface';

export interface ICreateSystemMessage extends CreateBaseContentModel {
  text: string;
  title?: string;
  params?: Record<string, string>;
}
