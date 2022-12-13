import { NotificationType, RenderFormat } from '@/notifications/schemas';
import { Translatable } from '@/i18n';
import { escapeHtmlIf, UrlRoute } from '@lyvely/common';
import { Notification } from '@/notifications/decorators';
import { Prop } from '@nestjs/mongoose';

@Notification()
export class TestNotification extends NotificationType<TestNotification> {
  @Prop()
  testProp: string;

  nonProp: string;

  getBody(format: RenderFormat): Translatable {
    return {
      key: 'test.notification.body',
      params: {
        user: escapeHtmlIf(this.userInfo.name, format === RenderFormat.HTML),
      },
    };
  }

  getTitle(format: RenderFormat): Translatable {
    return { key: 'test.notification.title' };
  }

  getUrl(): UrlRoute {
    return undefined;
  }
}
