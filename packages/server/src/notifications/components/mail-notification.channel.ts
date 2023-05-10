import { INotificationChannel } from '../interfaces';
import { UserSubscriptionContext } from '@/user-subscription';
import { INotificationRateLimit, User } from '@/users';
import {
  Notification,
  NotificationChannelDeliveryStatus,
  NotificationType,
  RenderFormat,
  UserNotification,
} from '../schemas';
import { Injectable, Logger } from '@nestjs/common';
import { MailService } from '@/mails';
import { BaseUserProfileRelationType, CalendarTimeInterval } from '@lyvely/common';
import { I18n, Translatable } from '@/i18n';
import { NotificationChannelRegistry } from '@/notifications/components/notification-channel.registry';
import { UrlGenerator } from '@/core';

@Injectable()
export class MailNotificationChannel implements INotificationChannel {
  private readonly logger = new Logger(MailNotificationChannel.name);

  constructor(
    private mailService: MailService,
    private i18n: I18n,
    private channelRegistry: NotificationChannelRegistry,
    private urlGenerator: UrlGenerator,
  ) {
    channelRegistry.registerChannel(this);
  }

  getId(): string {
    return 'email';
  }

  getTitle(): Translatable {
    return 'notifications.channels.email.title';
  }

  getRateLimit(): INotificationRateLimit {
    return {
      channel: this.getId(),
      max: 10,
      interval: CalendarTimeInterval.Hourly,
    };
  }

  isActive(user: User): boolean {
    return true;
  }

  async send(
    context: UserSubscriptionContext,
    notification: Notification,
    userNotification: UserNotification,
  ): Promise<NotificationChannelDeliveryStatus> {
    try {
      return this.sendMail(context, notification, userNotification);
    } catch (e: any) {
      this.logger.error(e);
      return new NotificationChannelDeliveryStatus({
        channel: this.getId(),
        success: false,
        error: e.message || 'Unknown error',
      });
    }
  }

  private async sendMail(
    context: UserSubscriptionContext,
    notification: Notification,
    userNotification: UserNotification,
  ) {
    const email = this.getEmail(context);
    if (!email) {
      return new NotificationChannelDeliveryStatus({
        channel: this.getId(),
        success: false,
        error: 'Could not determine target email for user',
      });
    }

    const { data } = notification;
    const { user } = context;

    const subject = this.i18n.t(
      data.getTitle({ receiver: user, format: RenderFormat.PLAINTEXT }),
      user,
    );
    const title = this.i18n.t(
      data.getTitle({
        receiver: user,
        format: RenderFormat.HTML,
      }),
      user,
    );
    const body = this.renderMailBody(user, userNotification, data);

    await this.mailService.sendMail({
      to: email,
      subject,
      partials: {
        headline: title,
        body,
      },
    });

    return new NotificationChannelDeliveryStatus({
      channel: this.getId(),
      success: true,
    });
  }

  private renderMailBody(user: User, userNotification: UserNotification, data: NotificationType) {
    const url = this.urlGenerator.getAppUrl({
      path: '/notification',
      query: { nid: userNotification.id },
    });
    const buttonText = this.i18n.t('notifications.actions.open', user);
    const button = `<a href="${url}">${buttonText}</a>`;
    return (
      this.i18n.t(data.getBody({ receiver: user, format: RenderFormat.HTML }), user) +
      '<br>' +
      button
    );
  }

  private getEmail(context: UserSubscriptionContext) {
    const membershipMail = context.relations?.find(
      (relation) => relation.type === BaseUserProfileRelationType.Membership,
    )?.userInfo.email;
    return membershipMail || context.user.email;
  }
}
