import { ContentModel } from '@/content';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class MessageModel extends ContentModel {
  static contentType = 'Message';

  @Expose()
  type = MessageModel.contentType;
}
