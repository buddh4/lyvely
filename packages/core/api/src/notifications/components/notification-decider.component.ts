import { Injectable, Logger } from '@nestjs/common';
import { INotificationChannel } from '../interfaces';
import { UserSubscriptionContext } from '@/user-subscriptions';
import { UserNotification, Notification } from '../schemas';
import { User } from '@/users';
import { UserStatus } from '@lyvely/interface';
import { NotificationCategoryRegistry } from './notification-category.registry';

@Injectable()
export class NotificationDecider {
  private readonly logger = new Logger(NotificationDecider.name);

  /**
   * Checks if a given notification was already delivered and if so, checks if we should resend it.
   * @param context
   * @param notification
   * @param userNotification
   */
  checkResend(
    context: UserSubscriptionContext,
    notification: Notification,
    userNotification?: UserNotification,
  ) {
    if (!userNotification) return true;
    if (!userNotification.status.deliveredAt) return true;
    if (notification.sortOrder <= userNotification.sortOrder) return false;

    return (
      Date.now() - userNotification.status.deliveredAt.getTime() >
      notification.getMinResendDuration()
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
    if (user.status !== UserStatus.Active) return false;

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
