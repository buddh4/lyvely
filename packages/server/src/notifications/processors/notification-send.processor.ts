import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QUEUE_NOTIFICATIONS_SEND } from '../notification.constants';
import { ISendNotificationJob, UserSubscriptionContext } from '../interfaces';
import { Notification, NotificationDeliveryStatus, UserNotification } from '../schemas';
import { Job } from 'bullmq';
import { NotificationChannelRegistry, NotificationSubscriptionService } from '../services';
import { NotificationDao, UserNotificationDao } from '../daos';
import { Logger } from '@nestjs/common';
import { assureObjectId, EntityIdentity } from '@/core';
import { NotificationDecider } from '@/notifications/components/notification-decider.component';
import { UsersService } from '@/users';

@Processor(QUEUE_NOTIFICATIONS_SEND)
export class NotificationSendProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationSendProcessor.name);

  constructor(
    private notificationDao: NotificationDao,
    private userNotificationDao: UserNotificationDao,
    private channelRegistry: NotificationChannelRegistry,
    private subscriptionService: NotificationSubscriptionService,
    private decider: NotificationDecider,
    private usersService: UsersService,
  ) {
    super();
  }

  async process(job: Job<ISendNotificationJob>): Promise<void> {
    return this.processNotification(job.data.nid);
  }

  async processNotification(identity: EntityIdentity<Notification>): Promise<void> {
    const notification =
      identity instanceof Notification ? identity : await this.notificationDao.findById(identity);

    if (!notification) throw new Error('Invalid notification id');

    const userSubscriptions = await this.subscriptionService.getSubscriptionContext(notification);

    const promises = [];
    userSubscriptions.forEach((userSubscription) => {
      promises.push(this.processUserNotification(userSubscription, notification));
    });

    await Promise.all(promises);
  }

  private async processUserNotification(
    context: UserSubscriptionContext,
    notification: Notification,
  ) {
    const userNotification = await this.userNotificationDao.findOne({
      uid: assureObjectId(context.user),
      nid: assureObjectId(notification),
    });

    if (!this.decider.checkRedelivery(context, notification, userNotification)) {
      // The notification was updated, but we do not want to redeliver it for some reason, so just update the seen state
      return this.markUnseen(userNotification, notification);
    }

    if (!userNotification) {
      await this.userNotificationDao.save(new UserNotification(context.user, notification));
    } else {
      await this.resetDeliveryState(userNotification);
    }

    return this.send(context, notification);
  }

  private async resetDeliveryState(userNotification: UserNotification) {
    return this.userNotificationDao.updateOneSetById(userNotification, {
      seen: false,
      sortOrder: userNotification.sortOrder,
      status: new NotificationDeliveryStatus(),
    });
  }

  private async markUnseen(userNotification: UserNotification, notification: Notification) {
    // If the notification was created before the user notification we do not need to update the state
    if (notification.sortOrder <= userNotification.sortOrder) {
      return;
    }

    return this.userNotificationDao.updateOneSetById(userNotification, {
      seen: false,
      sortOrder: notification.sortOrder,
    });
  }

  private async send(context: UserSubscriptionContext, notification: Notification): Promise<any> {
    const promises = [];
    const { user } = context;
    // Todo: (scalability) For bigger installations and bigger profiles, this should be queued e.g by user (fanout)
    this.channelRegistry.getNotificationChannels().forEach((channel) => {
      user.notification.incrementRateLimitCounter(channel.getRateLimit());
      if (this.decider.checkChannelDelivery(context, notification, channel)) {
        promises.push(channel.send(context, notification));
      }
    });

    promises.push(this.usersService.updateNotificationState(user, user.notification));

    return Promise.all(promises);
  }
}
