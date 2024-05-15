import { ITestPlugin } from '@/testing';
import { NotificationsModule } from '../notifications.module';
import { I18nModule, i18nITestPlugin } from '@/i18n';
import { mailITestPlugin } from '@/mails';
import { QUEUE_NOTIFICATIONS_SEND } from '../notification.constants';
import { BullModule, getQueueToken } from '@nestjs/bullmq';
import { NotificationQueueTester } from '../services';
import { LiveModule } from '@/live';
import { ProfilesModule } from '@/profiles';

export const notificationITestPlugin = {
  apply(builder) {
    builder
      .imports([
        NotificationsModule,
        I18nModule,
        BullModule.registerQueue({ name: QUEUE_NOTIFICATIONS_SEND }),
      ])
      .imports([LiveModule, ProfilesModule])
      .plugins([i18nITestPlugin, mailITestPlugin])
      .providers([NotificationQueueTester]);
  },
  prepare(moduleBuilder) {
    moduleBuilder.overrideProvider(getQueueToken(QUEUE_NOTIFICATIONS_SEND)).useValue({
      add: jest.fn(),
      process: jest.fn(),
      on: jest.fn(),
    });
  },
} as ITestPlugin;
