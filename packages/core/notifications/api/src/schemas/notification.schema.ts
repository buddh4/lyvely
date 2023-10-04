import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { NotificationType, NotificationTypeSchema } from './notification-type.schema';
import { BaseEntity, ObjectIdProp } from '@lyvely/core';

import {
  UserSubscriptionSchema,
  Subscription,
  UserSubscriptionSchemaAddition,
} from '@lyvely/user-subscriptions';

@Schema()
export class Notification<
  T extends NotificationType = NotificationType,
  TSubscription extends Subscription = Subscription,
> extends BaseEntity<Notification> {
  @Prop({ type: UserSubscriptionSchema, required: true })
  subscription: TSubscription;

  @ObjectIdProp()
  pid?: mongoose.Types.ObjectId;

  @Prop({ type: NotificationTypeSchema, required: true })
  data: T;

  @Prop({ required: true })
  sortOrder: number;

  @Prop({ required: true })
  category: string;

  constructor(data: T, subscription: Subscription, pid?: mongoose.Types.ObjectId) {
    super({
      data,
      subscription,
      pid,
      sortOrder: Date.now(),
      category: data.getCategory(),
    });
  }

  afterInit() {
    this.subscription = UserSubscriptionSchemaAddition.assureInstance(this.subscription);
  }

  getMinResendDuration() {
    return this.data.getMinRedeliveryDuration();
  }
}

export const NotificationSchema = UserSubscriptionSchemaAddition.addSubscriptionsSchemas(
  SchemaFactory.createForClass(Notification),
  'subscription',
);
