import { NotificationType } from './notification-type.schema';
import { Type } from '@lyvely/common';
import { SchemaFactory } from '@nestjs/mongoose';
import { Schema } from 'mongoose';
import { globalEmitter } from '@lyvely/core';
import { EVENT_REGISTER_NOTIFICATION_TYPE } from '../notification.constants';

const typeRegistry: Map<string, Type<NotificationType>> = new Map();
const typeSchemaRegistry: Map<string, Schema<NotificationType>> = new Map();

export class NotificationTypeSchemaFactory {
  static createForClass<TClass extends NotificationType>(target: Type<TClass>) {
    typeRegistry.set(target.name, target);
    const schema = SchemaFactory.createForClass<NotificationType>(target);
    typeSchemaRegistry.set(target.name, schema);
    globalEmitter.emit(EVENT_REGISTER_NOTIFICATION_TYPE, target, schema);
    return schema;
  }

  static getConstructorByType(type: string) {
    return typeRegistry.get(type);
  }

  static getSchemaByType(type: string | Type<NotificationType>): Schema<NotificationType> {
    const typeKey = typeof type === 'string' ? type : type.name;
    return typeSchemaRegistry.get(typeKey);
  }
}
