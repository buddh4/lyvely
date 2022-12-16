import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QUEUE_NOTIFICATIONS_SEND } from '../notification.constants';
import { ISendNotificationJob } from '../interfaces';
import { UserSubscriptionService, UserSubscriptionContext } from '@/user-subscription';
import { Notification, NotificationDeliveryStatus, UserNotification } from '../schemas';
import { Job } from 'bullmq';
import { NotificationChannelRegistry } from '../components';
import { NotificationDao, UserNotificationDao } from '../daos';
import { Logger } from '@nestjs/common';
import { assureObjectId, assureStringId, EntityIdentity } from '@/core';
import { NotificationDecider } from '@/notifications/components/notification-decider.component';
import { User, UsersService } from '@/users';
import { NewNotificationLiveEvent, ServiceException } from '@lyvely/common';
import { LiveService } from '@/live';

@Processor(QUEUE_NOTIFICATIONS_SEND)
export class NotificationSenderProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationSenderProcessor.name);

  constructor(
    private notificationDao: NotificationDao,
    private userNotificationDao: UserNotificationDao,
    private channelRegistry: NotificationChannelRegistry,
    private subscriptionService: UserSubscriptionService,
    private decider: NotificationDecider,
    private usersService: UsersService,
    private liveService: LiveService,
  ) {
    super();
  }

  async process(job: Job<ISendNotificationJob>): Promise<void> {
    try {
      return this.processNotification(job.data.nid);
    } catch (e) {
      this.logger.error(e);
    }
  }

  async processNotification(identity: EntityIdentity<Notification>): Promise<void> {
    const notification =
      identity instanceof Notification ? identity : await this.notificationDao.findById(identity);

    if (!notification) throw new ServiceException('Invalid notification id');

    const userSubscriptions = await this.subscriptionService.getSubscriptionContext(
      notification.subscription,
    );

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
    try {
      const userNotification = await this.userNotificationDao.findOne({
        uid: assureObjectId(context.user),
        nid: assureObjectId(notification),
      });

      if (!this.decider.checkResend(context, notification, userNotification)) {
        // The notification was updated, but we do not want to resend it for some reason, so we update the seen state
        return this.markUnseen(userNotification, notification);
      }

      if (!userNotification) {
        await this.createUserNotification(context, notification);
      } else {
        await this.resetDeliveryState(userNotification);
      }

      return this.send(context, notification);
    } catch (e) {
      this.logger.error(e);
    }
  }

  private async createUserNotification(
    context: UserSubscriptionContext,
    notification: Notification,
  ) {
    return this.userNotificationDao
      .save(new UserNotification(context.user, notification))
      .then(() => this.sendLiveEvent(context.user));
  }

  private async markUnseen(userNotification: UserNotification, notification: Notification) {
    /**
     * If the base notification was created before the user notification we do not need to update the state
     * this may happen as a result of a race condition, but usually should not be the case
     */
    if (notification.sortOrder <= userNotification.sortOrder) return;

    return this.userNotificationDao
      .updateOneSetById(userNotification, {
        seen: false,
        sortOrder: notification.sortOrder,
      })
      .then(() => this.sendLiveEvent(userNotification.uid));
  }

  private async sendLiveEvent(identity: EntityIdentity<User>) {
    return this.liveService.emitUserEvent(new NewNotificationLiveEvent(assureStringId(identity)));
  }

  private async resetDeliveryState(userNotification: UserNotification) {
    return this.userNotificationDao.updateOneSetById(userNotification, {
      seen: false,
      sortOrder: userNotification.sortOrder,
      status: new NotificationDeliveryStatus(),
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
