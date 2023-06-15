import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from '@lyvely/common';
import { assureObjectId, EntityIdentity, NestedSchema } from '@lyvely/server-core';
import { User } from '@/users';
import mongoose from 'mongoose';

@NestedSchema({ discriminatorKey: 'type' })
export class UserSubscription extends BaseModel<UserSubscription> {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
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

  @Prop({ type: [mongoose.Schema.Types.ObjectId] })
  uids?: TObjectId[];

  constructor(identities: EntityIdentity<User>[]) {
    super();
    this.uids = identities.map((identity) => assureObjectId(identity));
  }
}

@NestedSchema()
export class SingleUserSubscription extends UserSubscription {
  static typeName = 'user';
  type = SingleUserSubscription.typeName;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  uid?: TObjectId;

  constructor(identity: EntityIdentity<User>) {
    super();
    this.uid = assureObjectId(identity);
  }
}

export type Subscription = ProfileSubscription | SingleUserSubscription | MultiUserSubscription;
