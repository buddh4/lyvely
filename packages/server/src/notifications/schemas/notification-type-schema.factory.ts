import { NotificationType } from '@/notifications';
import { Type } from '@lyvely/common';
import { SchemaFactory } from '@nestjs/mongoose';
import { Schema } from 'mongoose';

const typeRegistry: Map<string, Type<NotificationType>> = new Map();
const typeSchemaRegistry: Map<string, Schema<NotificationType>> = new Map();

export class NotificationTypeSchemaFactory {
  static createForClass<TClass extends NotificationType>(target: Type<TClass>) {
    typeRegistry.set(target.name, target);
    const schema = SchemaFactory.createForClass<NotificationType>(target);
    typeSchemaRegistry.set(target.name, schema);
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
