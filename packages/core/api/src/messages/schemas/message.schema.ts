import { ContentAuthorPolicy, ContentDataType, ContentType, IContentPolicy } from '@/content';
import { IContentTypeMeta, MessageModel, RenderableType } from '@lyvely/interface';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Profile } from '@/profiles';
import { User } from '@/users';
import { TObjectId } from '@/core';
import { PropertiesOf, Type } from '@lyvely/common';

@Schema()
export class Message extends ContentType implements PropertiesOf<MessageModel<TObjectId>> {
  constructor(profile: Profile, user: User, text: string) {
    super(profile, user, {
      content: new ContentDataType({ text, renderType: RenderableType.translation }),
    });
  }

  toModel(): MessageModel {
    return new MessageModel(this);
  }

  override getWritePolicy(): Type<IContentPolicy> {
    // We only allow content authors to write message content.
    return ContentAuthorPolicy;
  }

  override getTypeMeta(): IContentTypeMeta {
    return super.getTypeMeta();
  }
}

export const MessageSchema = SchemaFactory.createForClass(Message);
