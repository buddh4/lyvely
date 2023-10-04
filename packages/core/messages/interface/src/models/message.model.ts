import { ContentModel } from '@lyvely/content-interface';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class MessageModel extends ContentModel {
  static contentType = 'Message';

  @Expose()
  type = MessageModel.contentType;
}
