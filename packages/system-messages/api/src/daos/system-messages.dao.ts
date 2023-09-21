import { ContentTypeDao } from '@lyvely/content';
import { SystemMessage } from '../schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

export class SystemMessagesDao extends ContentTypeDao<SystemMessage> {
  @InjectModel(SystemMessage.name)
  protected model: Model<SystemMessage>;

  getModelConstructor() {
    return SystemMessage;
  }

  getModuleId(): string {
    return 'system-message';
  }
}
