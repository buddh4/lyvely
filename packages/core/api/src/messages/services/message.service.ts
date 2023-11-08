import { ContentTypeService } from '@/content';
import { Message } from '../schemas';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { MessageDao } from '../daos';
import { Profile } from '@/profiles';
import { User } from '@/users';
import { CreateMessageModel } from '@lyvely/core-interface';
import { UpdateQuerySet } from '@/core';

@Injectable()
export class MessageService extends ContentTypeService<Message, CreateMessageModel> {
  @Inject()
  protected contentDao: MessageDao;

  protected logger = new Logger(MessageService.name);

  protected async createInstance(profile: Profile, user: User, model: CreateMessageModel) {
    return new Message(profile, user, model.text);
  }

  protected async createUpdate(
    profile: Profile,
    user: User,
    message: Message,
    model: Partial<CreateMessageModel>,
  ): Promise<UpdateQuerySet<Message>> {
    if (model.text) {
      message.content.text = model.text;
    }
    return message;
  }
}
