import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QUEUE_NOTIFICATIONS_SEND } from '../notification.constants';
import { ISendNotificationJob } from '../interfaces';
import { UserSubscriptionService, UserSubscriptionContext } from '@/user-subscription';
import {
  Notification,
  NotificationChannelDeliveryStatus,
  NotificationDeliveryStatus,
  UserNotification,
} from '../schemas';
import { Job } from 'bullmq';
import { NotificationChannelRegistry, NotificationDecider } from '../components';
import { Logger } from '@nestjs/common';
import { EntityIdentity } from '@lyvely/server-core';
import { UsersService } from '@/users';
import { ServiceException } from '@lyvely/common';
import { NotificationService, UserNotificationsService } from '../services';

@Processor(QUEUE_NOTIFICATIONS_SEND)
export class NotificationSenderProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationSenderProcessor.name);

  constructor(
    private usersService: UsersService,
    private userNotificationService: UserNotificationsService,
    private notificationService: NotificationService,
    private subscriptionService: UserSubscriptionService,
    private decider: NotificationDecider,
    private channelRegistry: NotificationChannelRegistry,
  ) {
    super();
  }

  async process(job: Job<ISendNotificationJob>): Promise<void> {
    return this.processNotification(job.data.nid).catch((err) => this.logger.error(err));
  }

  async processNotification(identity: EntityIdentity<Notification>): Promise<any> {
    const notification = await this.notificationService.findOne(identity);

    if (!notification) throw new ServiceException('Invalid notification id');

    const userSubscriptions = await this.subscriptionService.getSubscriptionContext(
      notification.subscription,
    );

    const promises = [];
    userSubscriptions.forEach((userSubscription) => {
      promises.push(
        this.processUserNotification(userSubscription, notification).catch((err) =>
          this.logger.error(err),
        ),
      );
    });

    await Promise.all(promises);
  }

  private async processUserNotification(
    context: UserSubscriptionContext,
    notification: Notification,
  ) {
    let userNotification = await this.userNotificationService.findOneByNotification(
      context.user,
      notification,
    );

    if (!this.decider.checkResend(context, notification, userNotification)) {
      /**
       * The notification was updated, but we do not want to resend it for some reason, so we just update the seen state
       *
       * If the base notification was created before the user notification we do not need to update the state
       * this may happen as a result of a race condition, but usually should not be the case
       */
      if (notification.sortOrder <= userNotification.sortOrder) return;
      return this.userNotificationService.markAsUnSeen(
        context.user,
        userNotification,
        notification.sortOrder,
      );
    }

    if (!userNotification) {
      userNotification = await this.userNotificationService.create(context.user, notification);
    } else {
      await this.userNotificationService.resetDeliveryState(userNotification);
    }

    await this.send(context, notification, userNotification);
    // TODO: Handle failed channels, retry, general error handling
    userNotification.status.deliveredAt = new Date();
    return this.userNotificationService.updateDeliveryState(userNotification);
  }

  private async send(
    context: UserSubscriptionContext,
    notification: Notification,
    userNotification: UserNotification,
  ): Promise<any> {
    const promises = [];
    const { user } = context;
    // Todo: (scalability) For bigger installations and bigger profiles, this should be queued e.g by user (fanout)
    this.channelRegistry.getNotificationChannels().forEach((channel) => {
      user.notification.incrementRateLimitCounter(channel.getRateLimit());
      if (this.decider.checkChannelDelivery(context, notification, channel)) {
        promises.push(
          channel
            .send(context, notification, userNotification)
            .then((status: NotificationChannelDeliveryStatus) => {
              userNotification.setChannelDeliveryStatus(status);
            })
            .catch((err) => this.logger.error(err)),
        );
      }
    });

    promises.push(this.usersService.updateNotificationState(user, user.notification));

    return Promise.all(promises);
  }
}
