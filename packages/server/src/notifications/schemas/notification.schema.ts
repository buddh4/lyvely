import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { NotificationType } from './notification-type.schema';
import { BaseEntity } from '@/core';
import { BaseModel } from '@lyvely/common';

@Schema({ id: false })
export class NotificationSubscription extends BaseModel<NotificationSubscription> {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  pid?: TObjectId;

  @Prop({ type: [mongoose.Schema.Types.ObjectId] })
  uids?: TObjectId[];
}

const NotificationSubscriptionSchema = SchemaFactory.createForClass(NotificationSubscription);

@Schema()
export class Notification<T extends NotificationType = NotificationType> extends BaseEntity<Notification> {
  @Prop({ type: NotificationSubscriptionSchema })
  subscription: NotificationSubscription;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  data: T;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
export type NotificationDocument = mongoose.Document & Notification;
