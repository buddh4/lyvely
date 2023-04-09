import { ContentTypeDao } from '@/content';
import { Message } from '@/message/schemas/message.schema';
import { Model } from 'mongoose';
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
