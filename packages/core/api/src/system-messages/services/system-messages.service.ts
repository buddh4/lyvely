import { ContentTypeService } from '@/content';
import { Message } from '@/messages';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { SystemMessagesDao } from '../daos';
import { Profile } from '@/profiles';
import { User } from '@/users';
import { UnsupportedOperationException } from '@lyvely/interface';
import { SystemMessage } from '../schemas';
import { UpdateQuerySet } from '@/core';
import { ICreateSystemMessage } from '../interfaces';

@Injectable()
export class SystemMessagesService extends ContentTypeService<SystemMessage, ICreateSystemMessage> {
  @Inject()
  protected contentDao: SystemMessagesDao;

  protected logger = new Logger(SystemMessagesService.name);

  protected async createInstance(profile: Profile, user: User, model: ICreateSystemMessage) {
    const { text, title, params } = model;
    return new SystemMessage(profile, user, {
      content: { text, title, params },
    });
  }

  protected createUpdate(
    profile: Profile,
    user: User,
    content: Message,
    model: Partial<ICreateSystemMessage>,
  ): Promise<UpdateQuerySet<Message>> {
    throw new UnsupportedOperationException();
  }
}
