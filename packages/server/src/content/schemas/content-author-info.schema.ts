import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from '../../db/base.entity';
import { DeepPartial, getStringEnumValues } from '@lyvely/common';
import mongoose from 'mongoose';
import { User } from '../../users/schemas/users.schema';
import { Profile } from '../../profiles';

export enum CreatedAsType {
  User = 'user',
  Profile = 'profile',
  Organization = 'orga'
}

export type Author = Profile | User;

@Schema()
export class CreatedAs extends BaseEntity<CreatedAs> {

  constructor(obj?: Author | DeepPartial<CreatedAs> ) {
    if(obj instanceof User) {
      super(createUserAuthor(obj));
    } else if(obj instanceof Profile) {
      super(createProfileAuthor(obj));
    } else {
      super(obj);
    }
  }

  @Prop( { type: String, enum: getStringEnumValues(CreatedAsType), required: true })
  type: CreatedAsType;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  authorId: TObjectId;

  @Prop()
  imageHash?: string;

  @Prop({ required: true })
  name: string;
}

export const ContentAuthorSchema = SchemaFactory.createForClass(CreatedAs);

export function createUserAuthor(author: User) {
  return new CreatedAs({
    type: CreatedAsType.User,
    authorId: author._id,
    name: author.getDisplayName(),
    imageHash: author.getImageHash()
  });
}

export function createProfileAuthor(author: Profile) {
  return new CreatedAs({
    type: CreatedAsType.User,
    authorId: author._id,
    name: author.name,
  });
}
