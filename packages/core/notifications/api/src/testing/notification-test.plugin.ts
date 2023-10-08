import { TestPlugin } from '@lyvely/testing';
import { NotificationsModule } from '../notifications.module';
import { I18nModule, i18nTestPlugin } from '@lyvely/i18n';
import { mailTestPlugin } from '@lyvely/mails';
import { QUEUE_NOTIFICATIONS_SEND } from '../notification.constants';
import { BullModule, getQueueToken } from '@nestjs/bullmq';
import { NotificationQueueTester } from '../services';

export const notificationTestPlugin = {
  apply(builder) {
    builder
      .imports([
        NotificationsModule,
        I18nModule,
        BullModule.registerQueue({ name: QUEUE_NOTIFICATIONS_SEND }),
      ])
      .plugins([i18nTestPlugin, mailTestPlugin])
      .providers([NotificationQueueTester]);
  },
  prepare(moduleBuilder) {
    moduleBuilder.overrideProvider(getQueueToken(QUEUE_NOTIFICATIONS_SEND)).useValue({
      add: jest.fn(),
      process: jest.fn(),
      on: jest.fn(),
    });
  },
} as TestPlugin;
