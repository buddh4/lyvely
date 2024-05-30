import { Injectable } from '@nestjs/common';
import type { Queue } from 'bullmq';
import { ISendNotificationJob } from '../interfaces';
import { InjectQueue } from '@nestjs/bullmq';
import { QUEUE_NOTIFICATIONS_SEND } from '../notification.constants';

@Injectable()
export class NotificationQueueTester {
  constructor(
    @InjectQueue(QUEUE_NOTIFICATIONS_SEND)
    public notificationQueue: Queue<ISendNotificationJob>
  ) {}
}
