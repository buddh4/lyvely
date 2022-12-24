import { AbstractContentService } from '@/content';
import { Message } from '@/message/schemas/message.schema';
import { Inject, Injectable } from '@nestjs/common';
import { MessageDao } from '../daos';
import { Profile } from '@/profiles';
import { User } from '@/users';
import { CreateMessage } from '@lyvely/common';

@Injectable()
export class MessageService extends AbstractContentService<Message> {
  @Inject()
  protected contentDao: MessageDao;

  async createMessage(profile: Profile, user: User, model: CreateMessage) {
    return this.createContent(
      profile,
      user,
      new Message(profile, user, model.text),
      model.tagNames,
    );
  }
}
