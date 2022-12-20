import { NotificationType, RenderFormat } from './notification-type.schema';
import { Notification } from '../decorators';
import { Translatable } from '@/i18n';
import { UrlRoute, formatDateWithTime } from '@lyvely/common';
import { Prop } from '@nestjs/mongoose';
import { TestNotificationCategory } from '@/notifications/models/test-notification-category.model';

@Notification()
export class TestNotification extends NotificationType<TestNotification> {
  @Prop()
  testValue: string;

  @Prop()
  date: Date;

  constructor(props) {
    super(props);
    this.date ||= new Date();
  }

  getTitle(format: RenderFormat): Translatable {
    return {
      key: 'notifications.test.title',
      params: {
        testKey: this.testValue,
      },
    };
  }

  getBody(format: RenderFormat): Translatable {
    return {
      key: 'notifications.test.body',
      params: {
        ts: formatDateWithTime(this.date || new Date()),
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
