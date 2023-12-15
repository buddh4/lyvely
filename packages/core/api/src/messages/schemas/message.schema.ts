import { ContentAuthorPolicy, ContentType, IContentPolicy } from '@/content';
import { IContentTypeMeta, MessageModel } from '@lyvely/interface';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Profile } from '@/profiles';
import { User } from '@/users';
import { TObjectId } from '@/core';
import { PropertiesOf, Type } from '@lyvely/common';

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

  getWritePolicy(): Type<IContentPolicy> {
    // We only allow content authors to write message content.
    return ContentAuthorPolicy;
  }

  getTypeMeta(): IContentTypeMeta {
    return super.getTypeMeta();
  }
}

export const MessageSchema = SchemaFactory.createForClass(Message);
