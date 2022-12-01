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
import { BullModule } from '@nestjs/bullmq';
import { QUEUE_NOTIFICATIONS_SEND } from '@/notifications/notification.constants';

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

const NotificationQueues = BullModule.registerQueue({
  name: QUEUE_NOTIFICATIONS_SEND,
});

@Module({})
export class NotificationCoreModule {
  static forRoot(): DynamicModule {
    return NotificationCoreModule.registerCore();
  }

  static registerCore() {
    return {
      module: NotificationsModule,
      imports: [NotificationModels, NotificationQueues],
      providers: [
        NotificationTypeRegistry,
        UserNotificationsService,
        UserNotificationDao,
        NotificationDao,
      ],
      exports: [UserNotificationsService, UserNotificationDao, NotificationDao],
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
