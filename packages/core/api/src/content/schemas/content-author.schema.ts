import { Prop, SchemaFactory } from '@nestjs/mongoose';
import {
  BaseDocument,
  NestedSchema,
  ObjectIdProp,
  type StrictBaseDocumentData,
  TObjectId,
} from '@/core';
import { getStringEnumValues } from '@lyvely/common';
import { CreatedAsType } from '@lyvely/interface';
import { User } from '@/users';
import { Organization, Profile } from '@/profiles';

export type Author = Profile | User;

@NestedSchema()
export class CreatedAs {
  _id: TObjectId;

  id: string;

  @Prop({ enum: getStringEnumValues(CreatedAsType), required: true })
  type: CreatedAsType;

  @ObjectIdProp({ required: true })
  authorId: TObjectId;

  constructor(obj?: Author | StrictBaseDocumentData<CreatedAs>) {
    if (obj instanceof User) {
      BaseDocument.init(this, createUserAuthor(obj));
    } else if (obj instanceof Organization) {
      BaseDocument.init(this, createOrganizationAuthor(obj));
    } else if (obj instanceof Profile) {
      BaseDocument.init(this, createProfileAuthor(obj));
    } else {
      BaseDocument.init(this, obj);
    }
  }
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
