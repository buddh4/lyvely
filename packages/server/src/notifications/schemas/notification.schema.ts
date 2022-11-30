import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import {
  NotificationType,
  NotificationTypeSchema,
} from './notification-type.schema';
import { BaseEntity } from '@/core';
import { BaseModel } from '@lyvely/common';

@Schema({ _id: false })
export class NotificationSubscription extends BaseModel<NotificationSubscription> {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  pid?: TObjectId;

  @Prop({ type: [mongoose.Schema.Types.ObjectId] })
  uids?: TObjectId[];
}

const NotificationSubscriptionSchema = SchemaFactory.createForClass(
  NotificationSubscription,
);

@Schema()
export class Notification<
  T extends NotificationType = NotificationType,
> extends BaseEntity<Notification> {
  @Prop({ type: NotificationSubscriptionSchema, required: true })
  subscription: NotificationSubscription;

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
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
