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
export class StatusError extends BaseModel<StatusError> {
  @Prop()
  message: string;

  @Prop()
  stack: string;

  constructor(error: any) {
    if (error instanceof Error) {
      super({
        message: error.message,
        stack: error.stack,
      });
    } else if (typeof error === 'string') {
      super({
        message: error,
      });
    } else {
      super({
        message: error?.message || 'Unknown error',
        stack: error?.stack,
      });
    }
  }
}

const StatusErrorSchema = SchemaFactory.createForClass(StatusError);

@NestedSchema()
export class NotificationChannelDeliveryStatus extends BaseModel<NotificationChannelDeliveryStatus> {
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

  constructor(init: Partial<NotificationChannelDeliveryStatus> = {}) {
    init.attempts = 0;
    init.date = new Date();
    super(init);
  }
}

const NotificationChannelDeliveryStatusSchema = SchemaFactory.createForClass(
  NotificationChannelDeliveryStatus,
);

@NestedSchema()
export class NotificationDeliveryStatus extends BaseModel<NotificationDeliveryStatus> {
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
export class UserNotification extends BaseDocument<UserNotification> {
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

  constructor(user: DocumentIdentity<User>, notification: Notification) {
    super({
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
