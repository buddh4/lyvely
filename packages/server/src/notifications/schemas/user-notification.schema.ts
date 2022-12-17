import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { assureObjectId, BaseEntity, EntityIdentity, NestedSchema } from '@/core';
import mongoose from 'mongoose';
import { isDefined } from 'class-validator';
import { PropertyType } from '@lyvely/common';
import { User } from '@/users';
import { Notification } from './notification.schema';

export enum DeliveryStatus {
  SENT,
  ERROR,
}

@NestedSchema()
export class NotificationChannelDeliveryStatus extends BaseEntity<NotificationChannelDeliveryStatus> {
  @Prop({ requried: true })
  channel: string;

  @Prop({ requried: true })
  @PropertyType(Boolean, { default: false })
  success: boolean;

  @Prop()
  error: string;
}

const NotificationChannelDeliveryStatusSchema = SchemaFactory.createForClass(
  NotificationChannelDeliveryStatus,
);

@NestedSchema()
export class NotificationDeliveryStatus extends BaseEntity<NotificationDeliveryStatus> {
  @Prop()
  success: boolean;

  @Prop({ type: Date })
  deliveredAt?: Date;

  @Prop({ requried: true })
  attempts: number;

  @Prop({ type: [NotificationChannelDeliveryStatusSchema] })
  channels: NotificationChannelDeliveryStatus[];

  constructor() {
    super({
      success: false,
      attempts: 0,
      channels: [],
    });
  }
}

const NotificationDeliveryStatusSchema = SchemaFactory.createForClass(NotificationDeliveryStatus);

@Schema()
export class UserNotification extends BaseEntity<UserNotification> {
  @Prop({ type: mongoose.Schema.Types.ObjectId, require: true })
  uid: TObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, require: true })
  nid: TObjectId;

  @Prop()
  @PropertyType(Boolean, { default: false })
  seen: boolean;

  @Prop({ type: NotificationDeliveryStatusSchema })
  @PropertyType(NotificationDeliveryStatus)
  status: NotificationDeliveryStatus;

  @Prop({ required: true })
  sortOrder: number;

  constructor(user: EntityIdentity<User>, notification: Notification) {
    super({
      uid: assureObjectId(user),
      nid: assureObjectId(notification),
      seen: false,
      sortOrder: notification.sortOrder,
    });
  }
}

export const UserNotificationSchema = SchemaFactory.createForClass(UserNotification);
