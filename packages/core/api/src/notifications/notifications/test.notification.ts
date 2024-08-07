import { NotificationType } from '../schemas';
import { Notification } from '../decorators';
import { Translatable } from '@/i18n';
import { UrlRoute } from '@lyvely/interface';
import { formatDateWithTime } from '@lyvely/dates';
import { Prop } from '@nestjs/mongoose';
import { TestNotificationCategory } from './test.notification-category';
import { BaseDocument, type BaseDocumentData } from '@/core';

@Notification()
export class TestNotification extends NotificationType {
  @Prop()
  testValue: string;

  @Prop()
  date: Date;

  constructor(data: BaseDocumentData<TestNotification>) {
    super(false);
    BaseDocument.init(this, data);
    this.date ||= new Date();
  }

  getTitle(): Translatable {
    return {
      key: 'notifications.test.title',
      params: {
        testKey: this.testValue,
      },
    };
  }

  getBody(): Translatable {
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
