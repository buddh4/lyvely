import { ContentUpdateResponse } from '@/content';
import { MessageModel } from '@/message';
import { Expose, Type } from 'class-transformer';
import { PropertyType } from '@/models';

export class MessageUpdateResponse extends ContentUpdateResponse<MessageModel> {
  @Expose()
  @Type(() => MessageModel)
  @PropertyType(MessageModel)
  model: MessageModel;
}
