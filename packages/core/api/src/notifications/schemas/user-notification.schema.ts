import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  assureObjectId,
  BaseDocument,
  DocumentIdentity,
  NestedSchema,
  ObjectIdProp,
  TObjectId,
} from '@/core';
import { BaseModel, PropertyType } from '@lyvely/common';
import { User } from '@/users';
import { Notification } from './notification.schema';

export enum DeliveryStatus {
  SENT,
  ERROR,
}

@NestedSchema()
export class StatusError {
  @Prop()
  message: string;

  @Prop()
  stack: string;

  constructor(error: any) {
    if (error instanceof Error) {
      BaseModel.init(this, {
        message: error.message,
        stack: error.stack,
      });
    } else if (typeof error === 'string') {
      BaseModel.init({
        message: error,
      });
    } else {
      BaseModel.init({
        message: error?.message || 'Unknown error',
        stack: error?.stack,
      });
    }
  }
}

const StatusErrorSchema = SchemaFactory.createForClass(StatusError);

@NestedSchema()
export class NotificationChannelDeliveryStatus {
  @Prop({ requried: true })
  channel: string;

  @Prop({ requried: true })
  @PropertyType(Boolean, { default: false })
  success: boolean;

  @Prop({ requried: true })
  attempts: 0;

  @Prop({ type: StatusErrorSchema })
  error?: StatusError;

  @Prop()
  date: Date;

  constructor(data: Partial<NotificationChannelDeliveryStatus> = {}) {
    data.attempts = 0;
    data.date = new Date();
    BaseModel.init(this, data);
  }
}

const NotificationChannelDeliveryStatusSchema = SchemaFactory.createForClass(
  NotificationChannelDeliveryStatus,
);

@NestedSchema()
export class NotificationDeliveryStatus {
  @Prop()
  success: boolean;

  @Prop({ type: Date })
  deliveredAt?: Date;

  @Prop({ requried: true })
  attempts: number;

  @Prop({ type: [NotificationChannelDeliveryStatusSchema] })
  channels: NotificationChannelDeliveryStatus[];

  constructor() {
    this.success = false;
    this.attempts = 0;
    this.channels = [];
  }
}

const NotificationDeliveryStatusSchema = SchemaFactory.createForClass(NotificationDeliveryStatus);

@Schema()
export class UserNotification {
  @ObjectIdProp({ required: true })
  uid: TObjectId;

  @ObjectIdProp({ required: true })
  nid: TObjectId;

  @Prop()
  @PropertyType(Boolean, { default: false })
  seen: boolean;

  @Prop({ type: NotificationDeliveryStatusSchema })
  @PropertyType(NotificationDeliveryStatus)
  status: NotificationDeliveryStatus;

  @Prop({ required: true })
  sortOrder: number;

  _id: TObjectId;

  id: string;

  constructor(user: DocumentIdentity<User>, notification: Notification) {
    BaseDocument.init<UserNotification>(this, {
      uid: assureObjectId(user),
      nid: assureObjectId(notification),
      seen: false,
      sortOrder: notification.sortOrder,
    });
  }

  getChannelDeliveryStatus(channel: string) {
    return this.status.channels.find((status) => status.channel === channel);
  }

  setChannelDeliveryStatus(status: NotificationChannelDeliveryStatus) {
    const existingStatus = this.getChannelDeliveryStatus(status.channel);
    if (!existingStatus) {
      this.status.channels.push(status);
    } else if (status.success) {
      existingStatus.success = true;
      delete existingStatus.error;
    } else {
      existingStatus.success = false;
      existingStatus.error = status.error;
    }
  }

  setDeliveryErrorStatus(channel: string, err: any) {
    const deliveryStatus =
      this.getChannelDeliveryStatus(channel) || new NotificationChannelDeliveryStatus({ channel });
    deliveryStatus.attempts += 1;
    deliveryStatus.success = false;
    deliveryStatus.error = new StatusError(err);
    this.setChannelDeliveryStatus(deliveryStatus);
  }

  getSortOrder(): number {
    return this.sortOrder;
  }
}

export const UserNotificationSchema = SchemaFactory.createForClass(UserNotification);
