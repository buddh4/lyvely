import { ContentTypeDao } from '@/content';
import { Message } from '../schemas';
import { Model } from '@/core';
import { InjectModel } from '@nestjs/mongoose';

export class MessageDao extends ContentTypeDao<Message> {
  @InjectModel(Message.name)
  protected model: Model<Message>;

  getModelConstructor() {
    return Message;
  }

  getModuleId(): string {
    return 'message';
  }
}
