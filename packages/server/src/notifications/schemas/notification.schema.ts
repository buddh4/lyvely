import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { NotificationType, NotificationTypeSchema } from './notification-type.schema';
import { assureObjectId, BaseEntity, createBaseEntityInstance, EntityIdentity } from '@/core';
import { BaseModel, PropertiesOf } from '@lyvely/common';
import { User } from '@/users';

@Schema({ _id: false, discriminatorKey: 'type' })
export class NotificationSubscription extends BaseModel<NotificationSubscription> {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  pid?: TObjectId;

  type: string;
}

const NotificationSubscriptionSchema = SchemaFactory.createForClass(NotificationSubscription);

@Schema({ _id: false })
export class ProfileSubscription extends NotificationSubscription {
  static typeName = 'profile';
  type = ProfileSubscription.typeName;
}

const ProfileSubscriptionSchema = SchemaFactory.createForClass(ProfileSubscription);

@Schema({ _id: false })
export class UsersSubscription extends NotificationSubscription {
  static typeName = 'users';
  type = UsersSubscription.typeName;

  @Prop({ type: [mongoose.Schema.Types.ObjectId] })
  uids?: TObjectId[];

  constructor(identities: EntityIdentity<User>[]) {
    super();
    this.uids = identities.map((identity) => assureObjectId(identity));
  }
}

const UsersSubscriptionSchema = SchemaFactory.createForClass(UsersSubscription);

@Schema({ _id: false })
export class UserSubscription extends NotificationSubscription {
  static typeName = 'user';
  type = UserSubscription.typeName;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  uid?: TObjectId;

  constructor(identity: EntityIdentity<User>) {
    super();
    this.uid = assureObjectId(identity);
  }
}

const UserSubscriptionSchema = SchemaFactory.createForClass(UserSubscription);

export type Subscription = ProfileSubscription | UserSubscription | UsersSubscription;

@Schema()
export class Notification<
  T extends NotificationType = NotificationType,
  TSubscription extends Subscription = Subscription,
> extends BaseEntity<Notification> {
  @Prop({ type: NotificationSubscriptionSchema, required: true })
  subscription: TSubscription;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  pid?: TObjectId;

  @Prop({ type: NotificationTypeSchema, required: true })
  data: T;

  @Prop({ required: true })
  sortOrder: number;

  @Prop({ required: true })
  category: string;

  constructor(data: T, subscription: Subscription, pid?: TObjectId) {
    super({
      data,
      subscription,
      pid,
      sortOrder: Date.now(),
      category: data.getCategory(),
    });
  }

  afterInit() {
    if (this.subscription && !(this.subscription instanceof NotificationSubscription)) {
      const SubscriptionType =
        SubscriptionTypes[(<PropertiesOf<NotificationSubscription>>this.subscription).type];
      this.subscription = createBaseEntityInstance(SubscriptionType, this.subscription);
    }
  }

  getMinRedeliveryDuration() {
    return this.data.getMinRedeliveryDuration();
  }
}

const SubscriptionTypes = {
  [ProfileSubscription.typeName]: ProfileSubscription,
  [UserSubscription.typeName]: UserSubscription,
  [UsersSubscription.typeName]: UsersSubscription,
};

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.path<mongoose.Schema.Types.Subdocument>('subscription').discriminator(
  ProfileSubscription.typeName,
  ProfileSubscriptionSchema,
);
NotificationSchema.path<mongoose.Schema.Types.Subdocument>('subscription').discriminator(
  UsersSubscription.typeName,
  UsersSubscriptionSchema,
);
NotificationSchema.path<mongoose.Schema.Types.Subdocument>('subscription').discriminator(
  UserSubscription.typeName,
  UserSubscriptionSchema,
);
