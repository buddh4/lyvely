import { SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from '@lyvely/common';
import {
  assureObjectId,
  DocumentIdentity,
  NestedSchema,
  ObjectIdArrayProp,
  ObjectIdProp,
  TObjectId,
} from '@/core';
import { User } from '@/users';

@NestedSchema({ discriminatorKey: 'type' })
export class UserSubscription extends BaseModel<UserSubscription> {
  @ObjectIdProp()
  pid?: TObjectId;

  type: string;
}

export const UserSubscriptionSchema = SchemaFactory.createForClass(UserSubscription);

@NestedSchema()
export class ProfileSubscription extends UserSubscription {
  static typeName = 'profile';
  type = ProfileSubscription.typeName;
}

@NestedSchema()
export class MultiUserSubscription extends UserSubscription {
  static typeName = 'users';
  type = MultiUserSubscription.typeName;

  @ObjectIdArrayProp()
  uids?: TObjectId[];

  constructor(identities: DocumentIdentity<User>[]) {
    super();
    this.uids = identities.map((identity) => assureObjectId(identity));
  }
}

@NestedSchema()
export class SingleUserSubscription extends UserSubscription {
  static typeName = 'user';
  type = SingleUserSubscription.typeName;

  @ObjectIdProp()
  uid?: TObjectId;

  constructor(identity: DocumentIdentity<User>) {
    super();
    this.uid = assureObjectId(identity);
  }
}

export type Subscription = ProfileSubscription | SingleUserSubscription | MultiUserSubscription;
