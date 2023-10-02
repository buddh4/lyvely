import {
  NotificationTypeRegistry,
  NotificationDecider,
  NotificationChannelRegistry,
  MailNotificationChannel,
} from './components';
import { UserNotificationsService, NotificationService } from './services';
import { UserNotificationDao, NotificationDao } from './daos';
import {
  Notification,
  NotificationSchema,
  UserNotification,
  UserNotificationSchema,
} from './schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { QUEUE_NOTIFICATIONS_SEND } from './notification.constants';
import { NotificationsController } from './controllers';
import { NotificationSenderProcessor } from './processors';
import { UsersModule } from '@lyvely/users';
import { ProfilesModule } from '@lyvely/profiles';
import { UserSubscriptionModule } from '@lyvely/user-subscriptions';
import { LiveModule } from '@lyvely/live';
import { LyvelyModule } from '@lyvely/core';

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

const NotificationQueues = BullModule.registerQueue({ name: QUEUE_NOTIFICATIONS_SEND });

@LyvelyModule({
  id: 'notifications',
  name: 'Notifications',
  path: __dirname,
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
    MailNotificationChannel,
  ],
  exports: [NotificationService, NotificationChannelRegistry, UserNotificationsService],
})
export class NotificationsModule {}
