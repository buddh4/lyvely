import { AbstractDao, createBaseEntityInstance } from '@/core';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from '../schemas';
import { DeepPartial, Type } from '@lyvely/common';
import { NotificationTypeSchemaFactory } from '@/notifications/schemas/notification-type-schema.factory';

@Injectable()
export class NotificationDao extends AbstractDao<Notification> {
  @InjectModel(Notification.name) protected model: Model<Notification>;

  getModuleId(): string {
    return 'notifications';
  }

  getModelConstructor(model: DeepPartial<Notification> | undefined): Type<Notification> {
    return Notification;
  }

  protected constructModel(lean?: DeepPartial<Notification>): Notification {
    const result = super.constructModel(lean);
    if (result.data?.type) {
      result.data = createBaseEntityInstance(
        NotificationTypeSchemaFactory.getConstructorByType(result.data.type),
        lean.data,
      );
    }
    return result;
  }
}
