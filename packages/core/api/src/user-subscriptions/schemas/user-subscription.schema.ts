import { SchemaFactory } from '@nestjs/mongoose';
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
export class UserSubscription {
  type: string;
}

export const UserSubscriptionSchema = SchemaFactory.createForClass(UserSubscription);

@NestedSchema()
export class ProfileSubscription extends UserSubscription {
  static typeName = 'profile';
  override type = ProfileSubscription.typeName;

  @ObjectIdProp()
  pid: TObjectId;

  constructor(pid: TObjectId) {
    super();
    this.pid = pid;
  }
}

export function isProfileUserSubscription(
  subscription: UserSubscription,
): subscription is ProfileSubscription {
  return subscription.type === ProfileSubscription.typeName;
}

@NestedSchema()
export class MultiUserSubscription extends UserSubscription {
  static typeName = 'users';
  override type = MultiUserSubscription.typeName;

  @ObjectIdArrayProp()
  uids: TObjectId[];

  constructor(identities: DocumentIdentity<User>[]) {
    super();
    this.uids = identities.map((identity) => assureObjectId(identity));
  }
}

export function isMultiUserSubscription(
  subscription: UserSubscription,
): subscription is MultiUserSubscription {
  return subscription.type === MultiUserSubscription.typeName;
}

@NestedSchema()
export class SingleUserSubscription extends UserSubscription {
  static typeName = 'user';
  override type = SingleUserSubscription.typeName;

  @ObjectIdProp()
  uid: TObjectId;

  constructor(identity: DocumentIdentity<User>) {
    super();
    this.uid = assureObjectId(identity);
  }
}

export function isSingleUserSubscription(
  subscription: UserSubscription,
): subscription is SingleUserSubscription {
  return subscription.type === SingleUserSubscription.typeName;
}

export type Subscription = ProfileSubscription | SingleUserSubscription | MultiUserSubscription;
