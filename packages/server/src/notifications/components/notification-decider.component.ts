import { Injectable, Logger } from '@nestjs/common';
import { INotificationChannel } from '../interfaces';
import { UserSubscriptionContext } from '@/user-subscription';
import { UserNotification, Notification } from '../schemas';
import { User } from '@/users';
import { NotificationCategoryRegistry } from '@/notifications/components/notification-category.registry';

@Injectable()
export class NotificationDecider {
  private readonly logger = new Logger(NotificationDecider.name);

  /**
   * Checks if a given notification was already delivered and if so, checks if we should redeliver it.
   * @param context
   * @param notification
   * @param userNotification
   */
  checkRedelivery(
    context: UserSubscriptionContext,
    notification: Notification,
    userNotification?: UserNotification,
  ) {
    if (!userNotification) return true;
    if (!userNotification.status.deliveredAt) return true;
    if (notification.sortOrder <= userNotification.sortOrder) return false;

    return (
      Date.now() - userNotification.status.deliveredAt.getTime() >
      notification.getMinRedeliveryDuration()
    );
  }

  checkChannelDelivery(
    context: UserSubscriptionContext,
    notification: Notification,
    channel: INotificationChannel,
  ) {
    const { user } = context;
    return (
      channel.isActive(user) &&
      this.checkUserPreferences(user, notification, channel) &&
      !user.notification.isRateLimited(channel.getRateLimit())
    );
  }

  private checkUserPreferences(
    user: User,
    notification: Notification,
    channel: INotificationChannel,
  ) {
    const category = NotificationCategoryRegistry.getCategory(notification.category);

    if (!category) {
      this.logger.warn(`Use of unknown notification category ${notification.category}`);
      return false;
    }

    const categoryPreference = user.notification?.preferences?.get(notification.category);

    return categoryPreference
      ? categoryPreference.includes(channel.getId())
      : category.getDefaultPreferences(channel.getId());
  }
}
