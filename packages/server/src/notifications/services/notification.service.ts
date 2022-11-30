import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import {
  Notification,
  NotificationSubscription,
  NotificationType,
} from '../schemas';
import { NotificationDao } from '../daos';
import {
  JOB_SEND_NOTIFICATION,
  QUEUE_NOTIFICATIONS_SEND,
} from '../notification.constants';
import { ISendNotificationJob } from '../interfaces';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectQueue(QUEUE_NOTIFICATIONS_SEND)
    private notificationQueue: Queue<ISendNotificationJob>,
    private notificationDao: NotificationDao,
  ) {}

  async sendNotification(
    data: NotificationType,
    subscription: NotificationSubscription,
  ) {
    const notification = await this.notificationDao.save(
      new Notification(data, subscription),
    );

    if (!notification)
      throw new InternalServerErrorException(
        `Could not save notification ${data?.type}`,
      );

    this.notificationQueue.add(JOB_SEND_NOTIFICATION, {
      nId: notification.id,
    });
  }
}
