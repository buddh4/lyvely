import { ContentUpdateResponse } from '@lyvely/content';
import { MessageModel } from './message.model';
import { Expose, Type } from 'class-transformer';
import { PropertyType } from '@lyvely/models';

export class MessageUpdateResponse extends ContentUpdateResponse<MessageModel> {
  @Expose()
  @Type(() => MessageModel)
  @PropertyType(MessageModel)
  model: MessageModel;
}
