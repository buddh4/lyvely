import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import {
  NotificationType,
  NotificationTypeSchema,
} from './notification-type.schema';
import { BaseEntity } from '@/core';
import { BaseModel } from '@lyvely/common';

@Schema({ _id: false, discriminatorKey: 'type' })
export class NotificationSubscription extends BaseModel<NotificationSubscription> {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  pid?: TObjectId;

  type: string;
}

const NotificationSubscriptionSchema = SchemaFactory.createForClass(
  NotificationSubscription,
);

@Schema({ _id: false })
export class ProfileSubscription extends NotificationSubscription {
  static typeName = 'profile';
  type = ProfileSubscription.typeName;
}

const ProfileSubscriptionSchema =
  SchemaFactory.createForClass(ProfileSubscription);
NotificationSubscriptionSchema.path<mongoose.Schema.Types.Subdocument>(
  'type',
).discriminator(ProfileSubscription.typeName, ProfileSubscriptionSchema);

@Schema({ _id: false })
export class UsersSubscription extends NotificationSubscription {
  static typeName = 'users';
  type = UsersSubscription.typeName;

  @Prop({ type: [mongoose.Schema.Types.ObjectId] })
  uids?: TObjectId[];
}

const UsersSubscriptionSchema = SchemaFactory.createForClass(UsersSubscription);
NotificationSubscriptionSchema.path<mongoose.Schema.Types.Subdocument>(
  'type',
).discriminator(UsersSubscription.typeName, UsersSubscriptionSchema);

@Schema({ _id: false })
export class UserSubscription {
  static typeName = 'user';
  type = UserSubscription.typeName;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  uid?: TObjectId;
}

const UserSubscriptionSchema = SchemaFactory.createForClass(UserSubscription);
NotificationSubscriptionSchema.path<mongoose.Schema.Types.Subdocument>(
  'type',
).discriminator(UserSubscription.typeName, UserSubscriptionSchema);

export type Subscription =
  | ProfileSubscription
  | UserSubscription
  | UsersSubscription;

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

  constructor(
    data: T,
    subscription: NotificationSubscription,
    pid?: TObjectId,
  ) {
    super({
      data,
      subscription,
      pid,
      sortOrder: Date.now(),
    });
  }

  afterInit() {
    if (
      this.subscription &&
      !(this.subscription instanceof NotificationSubscription)
    ) {
      const SubscriptionType = SubscriptionTypes[this.subscription.type];
      this.subscription = new SubscriptionType(this.subscription);
    }
  }
}

const SubscriptionTypes = {
  [ProfileSubscription.typeName]: ProfileSubscription,
  [UserSubscription.typeName]: ProfileSubscription,
  [UsersSubscription.typeName]: ProfileSubscription,
};

export const NotificationSchema = SchemaFactory.createForClass(Notification);
