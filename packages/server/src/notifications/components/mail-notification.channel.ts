import { INotificationChannel } from '../interfaces';
import { UserSubscriptionContext } from '@/user-subscription';
import { INotificationRateLimit, User } from '@/users';
import { Notification, NotificationChannelDeliveryStatus, RenderFormat } from '../schemas';
import { Injectable } from '@nestjs/common';
import { MailService } from '@/mails';
import { BaseUserProfileRelationType, CalendarTimeInterval } from '@lyvely/common';
import { I18n, Translatable } from '@/i18n';

@Injectable()
export class MailNotificationChannel implements INotificationChannel {
  constructor(private mailService: MailService, private i18n: I18n) {}

  getId(): string {
    return 'email';
  }

  getTitle(): Translatable {
    return 'notifications.channels.mail.title';
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
  ): Promise<NotificationChannelDeliveryStatus> {
    const email = this.getEmail(context);
    if (!email) {
      return new NotificationChannelDeliveryStatus({
        channel: this.getId(),
        success: false,
        error: 'Could not determine target email for user',
      });
    }

    const { data } = notification;

    const subject = this.i18n.t(data.getTitle(RenderFormat.PLAINTEXT), context.user);
    const title = this.i18n.t(data.getTitle(RenderFormat.HTML), context.user);
    const body = this.i18n.t(data.getBody(RenderFormat.HTML), context.user);

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

  private getEmail(context: UserSubscriptionContext) {
    const membershipMail = context.relations?.find(
      (relation) => relation.type === BaseUserProfileRelationType.Membership,
    )?.userInfo.email;
    return membershipMail || context.user.email;
  }
}
