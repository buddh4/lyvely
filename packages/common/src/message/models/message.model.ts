import { ContentModel } from '@/content';
import { Expose } from 'class-transformer';

@Expose()
export class MessageModel extends ContentModel {
  static contentType = 'Message';
  type = MessageModel.contentType;
}
