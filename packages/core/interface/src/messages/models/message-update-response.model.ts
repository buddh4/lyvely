import { ContentUpdateResponse } from '@/content';
import { MessageModel } from './message.model';
import { Expose } from 'class-transformer';
import { PropertyType } from '@lyvely/common';

export class MessageUpdateResponse extends ContentUpdateResponse<MessageModel> {
  @Expose()
  @PropertyType(MessageModel)
  model: MessageModel;
}
