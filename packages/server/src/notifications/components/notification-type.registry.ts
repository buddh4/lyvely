import { Injectable, Logger } from '@nestjs/common';
import { NotificationType, Notification, TNotificationType } from '../schemas';
import { AbstractTypeRegistry } from '@/core/components/abstract-type.registry';
import { globalEmitter } from '@/core';
import { EVENT_REGISTER_NOTIFICATION_TYPE } from '../notification.constants';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { Listener } from 'eventemitter2';

// This workaround is required since the notifications are registered before the registry is available
let queuedTypeSchemas: [TNotificationType, Schema<NotificationType>][] = [];
const globalListener = <Listener>globalEmitter.on(
  EVENT_REGISTER_NOTIFICATION_TYPE,
  (type: TNotificationType, schema: Schema<NotificationType>) => {
    queuedTypeSchemas.push([type, schema]);
  },
  { objectify: true },
);

@Injectable()
export class NotificationTypeRegistry extends AbstractTypeRegistry<NotificationType> {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
  ) {
    super(new Logger(NotificationTypeRegistry.name));
    globalListener.off();
    globalEmitter.on(
      EVENT_REGISTER_NOTIFICATION_TYPE,
      (type: TNotificationType, schema: Schema<NotificationType>) => {
        this.addNotificationDataTypeDiscriminator(type, schema);
      },
    );
    queuedTypeSchemas.forEach(([type, schema]) => {
      this.addNotificationDataTypeDiscriminator(type, schema);
    });
    queuedTypeSchemas = [];
  }

  private addNotificationDataTypeDiscriminator(
    type: TNotificationType,
    schema: Schema<NotificationType>,
  ) {
    this.notificationModel.schema
      .path<Schema.Types.Subdocument>('data')
      .discriminator(type.typeName, schema);
    this.registerType(type, type.typeName);
  }
}
