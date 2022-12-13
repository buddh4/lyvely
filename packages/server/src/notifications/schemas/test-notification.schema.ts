import { NotificationType, RenderFormat } from './notification-type.schema';
import { Notification } from '../decorators';
import { Translatable } from '@/i18n';
import { UrlRoute } from '@lyvely/common';
import { Prop } from '@nestjs/mongoose';
import { TestNotificationCategory } from '@/notifications/models/test-notification-category.model';

@Notification()
export class TestNotification extends NotificationType<TestNotification> {
  @Prop()
  testValue: string;

  getBody(format: RenderFormat): Translatable {
    return {
      key: 'notifications.test.body',
      params: {
        testKey: this.testValue,
      },
    };
  }

  getTitle(format: RenderFormat): Translatable {
    return {
      key: 'notifications.test.title',
      params: {
        ts: Date.now(),
      },
    };
  }

  getUrl(): UrlRoute {
    return { path: '/', query: { test: this.testValue } };
  }

  getCategory(): string {
    return TestNotificationCategory.ID;
  }
}
