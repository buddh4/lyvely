import { Injectable, Module, OnModuleInit, Type } from '@nestjs/common';
import { NotificationTypeRegistry } from '@/notifications/components/notification-type.registry';
import { UserNotificationsService } from '@/notifications/services/user-notifications.service';
import { UserNotificationDao, NotificationDao } from '@/notifications/daos';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import {
  NotificationType,
  Notification,
  NotificationSchema,
  UserNotification,
  UserNotificationSchema,
} from '@/notifications/schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';

const NotificationModels = MongooseModule.forFeature([
  {
    name: Notification.name,
    schema: NotificationSchema,
  },
  {
    name: UserNotification.name,
    schema: UserNotificationSchema,
  },
]);

@Module({})
export class NotificationCoreModule {
  static forRoot(): DynamicModule {
    return NotificationCoreModule.registerCore();
  }

  static registerCore() {
    return {
      module: NotificationsModule,
      imports: [NotificationModels],
      providers: [NotificationTypeRegistry, UserNotificationsService, UserNotificationDao, NotificationDao],
      exports: [
        NotificationTypeRegistry,
        UserNotificationsService,
        NotificationModels,
        UserNotificationDao,
        NotificationDao,
      ],
    };
  }
}

export interface NotificationTypeRegistration {
  type: Type<NotificationType>;
  schema: Schema<NotificationType>;
}

@Module({})
export class NotificationsModule {
  static forRoot() {
    return NotificationCoreModule.registerCore();
  }
}
