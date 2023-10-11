import { ContentModel } from '@/content';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class MessageModel<TID = string> extends ContentModel<TID> {
  static contentType = 'Message';

  @Expose()
  type = MessageModel.contentType;
}
