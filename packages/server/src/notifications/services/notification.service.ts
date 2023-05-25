import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Notification, NotificationType } from '../schemas';
import { Subscription } from '@/user-subscription';
import { NotificationDao } from '../daos';
import { JOB_SEND_NOTIFICATION, QUEUE_NOTIFICATIONS_SEND } from '../notification.constants';
import { ISendNotificationJob } from '../interfaces';
import { EntityIdentity } from '@/core';
import { User } from '@/users';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectQueue(QUEUE_NOTIFICATIONS_SEND)
    private notificationQueue: Queue<ISendNotificationJob>,
    private notificationDao: NotificationDao,
  ) {}

  async findOne(identity: EntityIdentity<Notification>) {
    return identity instanceof Notification
      ? identity
      : await this.notificationDao.findById(identity);
  }

  async sendNotification(data: NotificationType, subscription: Subscription) {
    const notification = await this.notificationDao.save(new Notification(data, subscription));
    this.notificationQueue.add(JOB_SEND_NOTIFICATION, { nid: notification.id });
  }
}
