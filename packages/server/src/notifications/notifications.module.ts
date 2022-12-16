import { Module } from '@nestjs/common';
import { NotificationTypeRegistry } from '@/notifications/components/notification-type.registry';
import { UserNotificationsService } from '@/notifications/services/user-notifications.service';
import { UserNotificationDao, NotificationDao } from '@/notifications/daos';
import {
  Notification,
  NotificationSchema,
  UserNotification,
  UserNotificationSchema,
} from '@/notifications/schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { QUEUE_NOTIFICATIONS_SEND } from '@/notifications/notification.constants';
import { NotificationCategoryRegistry } from '@/notifications/components/notification-category.registry';
import { DefaultNotificationCategory } from '@/notifications/models/default-notification-category.model';
import { NotificationDecider } from '@/notifications/components/notification-decider.component';
import { NotificationsController } from '@/notifications/controllers/notifications.controller';
import { NotificationSenderProcessor } from '@/notifications/processors/notification-sender.processor';
import { NotificationChannelRegistry } from '@/notifications/components/notification-channel.registry';
import { NotificationService } from '@/notifications/services/notification.service';
import { UsersModule } from '@/users';
import { ProfilesModule } from '@/profiles';
import { UserSubscriptionModule } from '@/user-subscription/user-subscription.module';
import { LiveModule } from '@/live/live.module';

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

NotificationCategoryRegistry.registerCategory(new DefaultNotificationCategory());

@Module({
  imports: [
    NotificationModels,
    NotificationQueues,
    UsersModule,
    ProfilesModule,
    UserSubscriptionModule,
    LiveModule,
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationService,
    NotificationTypeRegistry,
    UserNotificationsService,
    UserNotificationDao,
    NotificationDao,
    NotificationDecider,
    NotificationSenderProcessor,
    NotificationChannelRegistry,
  ],
  exports: [NotificationService, NotificationChannelRegistry],
})
export class NotificationsModule {}
