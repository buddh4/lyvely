import { Injectable, Logger } from '@nestjs/common';
import { NotificationType, Notification, TNotificationType } from '../schemas';
import { AbstractTypeRegistry, globalEmitter, Model, Schema, Subdocument } from '@/core';
import { EVENT_REGISTER_NOTIFICATION_TYPE } from '../notification.constants';
import { InjectModel } from '@nestjs/mongoose';
import type { Listener } from 'eventemitter2';

// This workaround is required since the notifications are registered before the registry is available
const queuedTypeSchemas: [TNotificationType, Schema<NotificationType>][] = [];
const globalListener = globalEmitter.on(
  EVENT_REGISTER_NOTIFICATION_TYPE,
  (type: TNotificationType, schema: Schema<NotificationType>) => {
    queuedTypeSchemas.push([type, schema]);
  },
  { objectify: true }
) as Listener;

@Injectable()
export class NotificationTypeRegistry extends AbstractTypeRegistry<NotificationType> {
  protected logger = new Logger(NotificationTypeRegistry.name);
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>
  ) {
    super();
    globalListener.off();
    globalEmitter.on(
      EVENT_REGISTER_NOTIFICATION_TYPE,
      (type: TNotificationType, schema: Schema<NotificationType>) => {
        this.addNotificationDataTypeDiscriminator(type, schema);
      }
    );
    queuedTypeSchemas.forEach(([type, schema]) => {
      this.addNotificationDataTypeDiscriminator(type, schema);
    });
  }

  private addNotificationDataTypeDiscriminator(
    type: TNotificationType,
    schema: Schema<NotificationType>
  ) {
    const notificationTypePath = this.notificationModel.schema.path<Subdocument>('data');

    if (
      !notificationTypePath.schema.discriminators ||
      !notificationTypePath.schema.discriminators[type.typeName]
    ) {
      this.notificationModel.schema.path<Subdocument>('data').discriminator(type.typeName, schema);
    }

    this.registerType(type, type.typeName);
  }
}
