import { TestPlugin } from '@/testing';
import { NotificationsModule } from '../notifications.module';
import { I18nModule, i18nTestPlugin } from '@/i18n';
import { mailTestPlugin } from '@/mails';
import { QUEUE_NOTIFICATIONS_SEND } from '../notification.constants';
import { BullModule, getQueueToken } from '@nestjs/bullmq';
import { NotificationQueueTester } from '../services';
import { LiveModule } from '@/live';
import { ProfilesModule } from '@/profiles';

export const notificationTestPlugin = {
  apply(builder) {
    builder
      .imports([
        NotificationsModule,
        I18nModule,
        BullModule.registerQueue({ name: QUEUE_NOTIFICATIONS_SEND }),
      ])
      .imports([LiveModule, ProfilesModule])
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
