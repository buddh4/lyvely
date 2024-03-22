import { AbstractDao, createBaseDocumentInstance, LeanDoc, Model } from '@/core';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from '../schemas';
import { DeepPartial, Type } from '@lyvely/common';
import { NotificationTypeRegistry } from '../components';

@Injectable()
export class NotificationDao extends AbstractDao<Notification> {
  @InjectModel(Notification.name) protected model: Model<Notification>;

  constructor(private notificationTypeRegistry: NotificationTypeRegistry) {
    super();
  }

  getModuleId(): string {
    return 'notifications';
  }

  getModelConstructor(): Type<Notification> {
    return Notification;
  }

  protected override constructModel(lean: LeanDoc<Notification>): Notification {
    const result = super.constructModel(lean);
    if (result.data?.type) {
      result.data = createBaseDocumentInstance(
        this.notificationTypeRegistry.getTypeConstructor(result.data.type)!,
        lean.data!,
      );
    }
    return result;
  }
}
