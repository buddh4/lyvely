import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QUEUE_NOTIFICATIONS_SEND } from '../notification.constants';
import {
  ISendNotificationJob,
  NotificationDeliveryResult,
} from '../interfaces';
import { Notification } from '../schemas';
import { Job } from 'bullmq';
import {
  NotificationChannelRegistry,
  NotificationSubscriptionService,
  SubscriptionContext,
} from '../services';
import { NotificationDao, UserNotificationDao } from '../daos';
import { Logger } from '@nestjs/common';
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
  ) {
    super();
  }

  async process(
    job: Job<ISendNotificationJob>,
  ): Promise<NotificationDeliveryResult[]> {
    const notification = await this.notificationDao.findById(job.data.nid);
    if (!notification) throw new Error('Invalid notification id');

    const subscriptions = await this.subscriptionService.getSubscriptionContext(
      notification,
    );

    const promises = [];
    subscriptions.forEach((subscription) => {
      promises.push(this.send(subscription, notification));
    });

    return Promise.all(promises);
  }

  private async send(
    context: SubscriptionContext,
    notification: Notification,
  ): Promise<NotificationDeliveryResult[]> {
    const promises = [];
    this.channelRegistry.getNotificationChannels().forEach((channel) => {
      promises.push(channel.send(context, notification));
    });
    return Promise.all(promises);
  }
}
