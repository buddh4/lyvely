import { ContentModel } from '@/content';
import { Exclude, Expose } from 'class-transformer';
import { IEditableModel } from '@lyvely/common';
import { UpdateMessageModel } from './update-message.model';

@Exclude()
export class MessageModel<TID = string>
  extends ContentModel<TID>
  implements IEditableModel<UpdateMessageModel>
{
  static contentType = 'Message';

  @Expose()
  type = MessageModel.contentType;

  toEditModel(): UpdateMessageModel {
    return new UpdateMessageModel({
      text: this.content.text,
    });
  }
}
