import { ContentType } from '@/content';
import { MessageModel } from '@lyvely/core-interface';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Profile } from '@/profiles';
import { User } from '@/users';
import { Types } from 'mongoose';

@Schema()
export class Message extends ContentType<Message> implements MessageModel<Types.ObjectId> {
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
