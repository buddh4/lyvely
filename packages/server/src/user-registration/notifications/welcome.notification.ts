import { NotificationType, RenderFormat } from '@/notifications/schemas/notification-type.schema';
import { Prop } from '@nestjs/mongoose';
import { Translatable } from '@/i18n';
import { escapeHtmlIf } from '@lyvely/common';

export class WelcomeNotification extends NotificationType {
  @Prop()
  appName: string;

  getBody(format: RenderFormat): Translatable {
    return {
      key: 'user_registration.notifications.welcome.body',
      params: {
        appName: escapeHtmlIf(this.appName, format === RenderFormat.HTML),
      },
    };
  }

  getTitle(format: RenderFormat): Translatable {
    return undefined;
  }

  getUrl() {
    return null;
  }
}
