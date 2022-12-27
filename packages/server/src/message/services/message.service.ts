import { AbstractContentService } from '@/content';
import { Message } from '@/message/schemas/message.schema';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { MessageDao } from '../daos';
import { Profile } from '@/profiles';
import { User } from '@/users';
import { CreateMessage } from '@lyvely/common';

@Injectable()
export class MessageService extends AbstractContentService<Message, CreateMessage> {
  @Inject()
  protected contentDao: MessageDao;

  protected logger = new Logger(MessageService.name);

  protected async createInstance(profile: Profile, user: User, model: CreateMessage) {
    return new Message(profile, user, model.text);
  }
}
