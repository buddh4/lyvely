import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NotificationType, NotificationTypeSchema } from './notification-type.schema';
import { BaseDocument, ObjectIdProp, TObjectId } from '@/core';

import {
  UserSubscriptionSchema,
  Subscription,
  UserSubscriptionSchemaAddition,
} from '@/user-subscriptions';

@Schema()
export class Notification<
  T extends NotificationType = NotificationType,
  TSubscription extends Subscription = Subscription,
> {
  _id: TObjectId;

  id: string;

  @Prop({ type: UserSubscriptionSchema, required: true })
  subscription: TSubscription;

  @ObjectIdProp()
  pid?: TObjectId;

  @Prop({ type: NotificationTypeSchema, required: true })
  data: T;

  @Prop({ required: true })
  sortOrder: number;

  @Prop({ required: true })
  category: string;

  constructor(data: T, subscription: TSubscription, pid?: TObjectId) {
    BaseDocument.init<Notification>(this, {
      subscription,
      pid,
      data,
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
  'subscription'
);
