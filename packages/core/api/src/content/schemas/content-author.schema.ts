import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity, NestedSchema } from '@/core';
import { DeepPartial, getStringEnumValues } from '@lyvely/common';
import { CreatedAsType } from '@lyvely/core-interface';
import mongoose from 'mongoose';
import { User } from '@/users';
import { Organization, Profile } from '@/profiles';

export type Author = Profile | User;

@NestedSchema()
export class CreatedAs extends BaseEntity<CreatedAs> {
  constructor(obj?: Author | DeepPartial<CreatedAs>) {
    if (obj instanceof User) {
      super(createUserAuthor(obj));
    } else if (obj instanceof Organization) {
      super(createOrganizationAuthor(obj));
    } else if (obj instanceof Profile) {
      super(createProfileAuthor(obj));
    } else {
      super(obj);
    }
  }

  @Prop({ enum: getStringEnumValues(CreatedAsType), required: true })
  type: CreatedAsType;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  authorId: mongoose.Types.ObjectId;
}

export const ContentAuthorSchema = SchemaFactory.createForClass(CreatedAs);

export function createUserAuthor(author: User) {
  return new CreatedAs({
    type: CreatedAsType.User,
    authorId: author._id,
  });
}

export function createProfileAuthor(author: Profile) {
  return new CreatedAs({
    type: CreatedAsType.Profile,
    authorId: author._id,
  });
}

export function createOrganizationAuthor(author: Organization) {
  return new CreatedAs({
    type: CreatedAsType.Organization,
    authorId: author._id,
  });
}