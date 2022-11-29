import { Schema } from '@nestjs/mongoose';
import { NotificationSchemaType } from '@/notifications';
import { NotificationTypeSchemaFactory } from '@/notifications/schemas/notification-type-schema.factory';
import { Type } from '@lyvely/common';

export function Notification() {
  return function <T extends Type<NotificationSchemaType>>(constructor: T) {
    Schema({ _id: false })(constructor);

    const TypeConstructor = class extends constructor {
      type = constructor.name;
      static typeName = constructor.name;
    };

    NotificationTypeSchemaFactory.createForClass(TypeConstructor);

    return TypeConstructor;
  };
}
