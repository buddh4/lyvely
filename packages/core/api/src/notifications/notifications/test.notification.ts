import { NotificationContext, NotificationType } from '../schemas';
import { Notification } from '../decorators';
import { Translatable } from '@/i18n';
import { UrlRoute } from '@lyvely/interface';
import { formatDateWithTime } from '@lyvely/dates';
import { Prop } from '@nestjs/mongoose';
import { TestNotificationCategory } from './test.notification-category';

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

  getTitle(format: NotificationContext): Translatable {
    return {
      key: 'notifications.test.title',
      params: {
        testKey: this.testValue,
      },
    };
  }

  getBody(format: NotificationContext): Translatable {
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
