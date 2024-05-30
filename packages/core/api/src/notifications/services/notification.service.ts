import { Injectable, Logger } from '@nestjs/common';
import type { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Notification, NotificationType } from '../schemas';
import { Subscription } from '@/user-subscriptions';
import { NotificationDao } from '../daos';
import { JOB_SEND_NOTIFICATION, QUEUE_NOTIFICATIONS_SEND } from '../notification.constants';
import { ISendNotificationJob } from '../interfaces';
import { DocumentIdentity } from '@/core';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectQueue(QUEUE_NOTIFICATIONS_SEND)
    private notificationQueue: Queue<ISendNotificationJob>,
    private notificationDao: NotificationDao
  ) {}

  async findOne(identity: DocumentIdentity<Notification>) {
    return identity instanceof Notification
      ? identity
      : await this.notificationDao.findById(identity);
  }

  async sendNotification(data: NotificationType, subscription: Subscription) {
    const notification = await this.notificationDao.save(new Notification(data, subscription));
    return this.notificationQueue.add(JOB_SEND_NOTIFICATION, { nid: notification.id });
  }
}
