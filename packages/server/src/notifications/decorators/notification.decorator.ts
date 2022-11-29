//export function Notification(constructor: T) {}

import { Schema } from '@nestjs/mongoose';
import { NotificationSchemaType } from '@/notifications';
import { NotificationTypeSchemaFactory } from '@/notifications/schemas/notification-type-schema.factory';
import { Type } from '@lyvely/common';

type Constructor = { new (...args: any[]): {} };

export function Notification(type?: string) {
  return function <T extends Type<NotificationSchemaType>>(constructor: T) {
    Schema({ _id: false })(constructor);

    NotificationTypeSchemaFactory.createForClass(constructor);

    return class extends constructor {
      type = type || constructor.name;
    };
  };
}
