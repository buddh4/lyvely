import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { NotificationType, NotificationTypeSchema } from './notification-type.schema';
import { BaseEntity } from '@/core';

import {
  UserSubscriptionSchema,
  Subscription,
  UserSubscriptionSchemaAddition,
} from '@/user-subscription';

@Schema()
export class Notification<
  T extends NotificationType = NotificationType,
  TSubscription extends Subscription = Subscription,
> extends BaseEntity<Notification> {
  @Prop({ type: UserSubscriptionSchema, required: true })
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
    this.subscription = UserSubscriptionSchemaAddition.assureInstance(this.subscription);
  }

  getMinRedeliveryDuration() {
    return this.data.getMinRedeliveryDuration();
  }
}

export const NotificationSchema = UserSubscriptionSchemaAddition.addSubscriptionsSchemas(
  SchemaFactory.createForClass(Notification),
  'subscription',
);
