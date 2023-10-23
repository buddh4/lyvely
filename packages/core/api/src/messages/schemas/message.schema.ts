import { ContentType } from '@/content';
import { MessageModel } from '@lyvely/core-interface';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Profile } from '@/profiles';
import { User } from '@/users';
import { TObjectId } from '@/core';
import { PropertiesOf } from '@lyvely/common';

@Schema()
export class Message extends ContentType<Message> implements PropertiesOf<MessageModel<TObjectId>> {
  constructor(profile: Profile, user: User, text: string) {
    super(profile, user, {
      content: { text },
    });
  }

  toModel(): MessageModel {
    return new MessageModel(this);
  }
}

export const MessageSchema = SchemaFactory.createForClass(Message);
