import { ContentType } from '@/content';
import { ContentModel, Type, MessageModel } from '@lyvely/common';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Profile } from '@/profiles';
import { User } from '@/users';

@Schema()
export class Message extends ContentType<Message> {
  constructor(profile: Profile, user: User, text: string) {
    super(profile, user, {
      content: { text },
    });
  }

  getModelConstructor(): Type<ContentModel> {
    return MessageModel;
  }
}

export const MessageSchema = SchemaFactory.createForClass(Message);
