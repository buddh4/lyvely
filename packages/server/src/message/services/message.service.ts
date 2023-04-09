import { ContentTypeService } from '@/content';
import { Message } from '@/message/schemas/message.schema';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { MessageDao } from '../daos';
import { Profile } from '@/profiles';
import { User } from '@/users';
import { CreateMessage } from '@lyvely/common';
import { UpdateQuerySet } from '@/core';

@Injectable()
export class MessageService extends ContentTypeService<Message, CreateMessage> {
  @Inject()
  protected contentDao: MessageDao;

  protected logger = new Logger(MessageService.name);

  protected async createInstance(profile: Profile, user: User, model: CreateMessage) {
    return new Message(profile, user, model.text);
  }

  protected createUpdate(
    profile: Profile,
    user: User,
    content: Message,
    model: Partial<CreateMessage>,
  ): Promise<UpdateQuerySet<Message>> {
    return Promise.resolve(undefined);
  }
}
