import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QUEUE_NOTIFICATIONS_SEND } from '../notification.constants';
import { ISendNotificationJob, NotificationContext } from '../interfaces';
import { Notification, UserNotification } from '../schemas';
import { Job } from 'bullmq';
import {
  NotificationChannelRegistry,
  NotificationSubscriptionService,
} from '../services';
import { NotificationDao, UserNotificationDao } from '../daos';
import { Logger } from '@nestjs/common';
import { UserStatus } from '@lyvely/common';
import { ProfilesService } from '@/profiles';
import { UsersService } from '@/users';

@Processor(QUEUE_NOTIFICATIONS_SEND)
export class NotificationSendProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationSendProcessor.name);

  constructor(
    private notificationDao: NotificationDao,
    private userNotificationDao: UserNotificationDao,
    private channelRegistry: NotificationChannelRegistry,
    private subscriptionService: NotificationSubscriptionService,
    private profileService: ProfilesService,
    private userService: UsersService,
  ) {
    super();
  }

  async process(job: Job<ISendNotificationJob>) {
    const notification = await this.notificationDao.findById(job.id);
    if (!notification) throw new Error('Invalid notification id');

    if (notification.subscription.pid) {
      return this.sendProfileSubscription(notification, job.data);
    } else if (notification.subscription.uids?.length) {
      return this.sendUserSubscription(notification, job.data);
    }
  }

  private async sendProfileSubscription(
    notification: Notification,
    data: ISendNotificationJob,
  ) {
    const batches = await this.subscriptionService.getProfileSubscriptions(
      notification,
    );

    const nextBatch = data.batch ?? 1;

    if (nextBatch > batches.length) {
      this.logger.warn('Notification job queued with invalid batch');
      return;
    }

    const batch = batches[nextBatch - 1];
    const promises = [];

    for (let i = 0; i < batch.length; i++) {
      const membership = batch[i];
      const user = await this.userService.findUserById(membership.uid);

      if (user.status !== UserStatus.Active) {
        continue;
      }

      const userNotification = await this.userNotificationDao.save(
        new UserNotification({
          uid: user._id,
          notificationId: notification._id,
          seen: false,
          sortOrder: notification.sortOrder,
        }),
      );

      promises.push(
        this.send({ user, profileRelation: membership }, notification),
      );
    }

    return Promise.all(promises);
  }

  private async send(context: NotificationContext, notification: Notification) {
    const promises = [];
    this.channelRegistry.getNotificationChannels().forEach((channel) => {
      promises.push(channel.send(context, notification));
    });
    return Promise.all(promises);
  }

  private async sendUserSubscription(
    notification: Notification,
    data: ISendNotificationJob,
  ) {
    const users = await this.subscriptionService.getUserSubscriptions(
      notification,
    );
    const profile = notification.pid
      ? await this.profileService.findProfileById(notification.pid)
      : undefined;

    const promises = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const profileRelation = profile
        ? await this.profileService.findUserProfileRelations(user, profile)
        : undefined;

      promises.push(
        this.send(
          {
            user,
            profileRelation,
          },
          notification,
        ),
      );
    }
  }
}
