import { INotificationService } from '../interfaces';
import { Notification } from '../schemas';
import { Injectable } from '@nestjs/common';
import { NotificationChannelRegistry } from '../services/notification-channel.registry';
import { NotificationSubscriptionService } from './notification-subscription.service';
import { cloneDeep } from 'lodash';

@Injectable()
export class ImmediateNotificationService implements INotificationService {
  constructor(
    private registry: NotificationChannelRegistry,
    private subscriptionService: NotificationSubscriptionService,
  ) {}

  async send(notification: Notification) {
    const userIds = await this.subscriptionService.getUserIds(notification);
    const notifications = [];

    const webNotifications = [];
    /*userIds.forEach((uid) => {
      const webNotification = cloneDeep(notification);
      webNotification.uid = uid;
    });*/

    this.registry.getNotificationChannels().forEach((channel) => {
      //channel.sendBulk(notifications);
    });
  }
}
