import { SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from '@lyvely/common';
import { assureObjectId, EntityIdentity, NestedSchema, ObjectIdProp } from '@lyvely/core';
import { User } from '@lyvely/users';
import { Types } from 'mongoose';

@NestedSchema({ discriminatorKey: 'type' })
export class UserSubscription extends BaseModel<UserSubscription> {
  @ObjectIdProp()
  pid?: Types.ObjectId;

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

  @ObjectIdProp()
  uids?: Types.ObjectId[];

  constructor(identities: EntityIdentity<User>[]) {
    super();
    this.uids = identities.map((identity) => assureObjectId(identity));
  }
}

@NestedSchema()
export class SingleUserSubscription extends UserSubscription {
  static typeName = 'user';
  type = SingleUserSubscription.typeName;

  @ObjectIdProp()
  uid?: Types.ObjectId;

  constructor(identity: EntityIdentity<User>) {
    super();
    this.uid = assureObjectId(identity);
  }
}

export type Subscription = ProfileSubscription | SingleUserSubscription | MultiUserSubscription;
