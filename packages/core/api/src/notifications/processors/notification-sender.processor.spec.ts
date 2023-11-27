import { buildTest, LyvelyTestingModule } from '@/testing';
import { NotificationDao, Notification as NotificationDecorator } from '../index';
import { Notification, NotificationContext, NotificationType, RenderFormat } from '../schemas';
import { SingleUserSubscription } from '@/user-subscriptions';
import { NotificationSenderProcessor } from './notification-sender.processor';
import { UserNotificationsService } from '../services';
import { UserInfo } from '@/users';
import { Prop } from '@nestjs/mongoose';
import { Translatable } from '@/i18n';
import { UrlRoute } from '@lyvely/interface';
import { escapeHtmlIf } from '@lyvely/common';
import { TestNotificationCategory } from '../notifications';
import { profilesTestPlugin, ProfileTestDataUtils } from '@/profiles';
import { notificationTestPlugin } from '../testing';

const TEST_KEY = 'NotificationSendProcessor';

@NotificationDecorator()
export class MyTestNotification extends NotificationType<MyTestNotification> {
  @Prop()
  testProp: string;

  nonProp: string;

  getBody(context: NotificationContext): Translatable {
    return {
      key: 'test.notification.body',
      params: {
        user: escapeHtmlIf(this.userInfo!.name, context.format === RenderFormat.HTML),
      },
    };
  }

  getTitle(format: NotificationContext): Translatable {
    return { key: 'test.notification.title' };
  }

  getUrl(): UrlRoute | null {
    return null;
  }

  getCategory(): string {
    return TestNotificationCategory.ID;
  }
}

describe('NotificationSendProcessor', () => {
  let testingModule: LyvelyTestingModule;
  let notificationDao: NotificationDao;
  let testData: ProfileTestDataUtils;
  let processor: NotificationSenderProcessor;
  let userNotificationService: UserNotificationsService;

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY)
      .plugins([profilesTestPlugin, notificationTestPlugin])
      .compile();
    notificationDao = testingModule.get(NotificationDao);
    testData = testingModule.get(ProfileTestDataUtils);
    processor = testingModule.get(NotificationSenderProcessor);
    userNotificationService = testingModule.get(UserNotificationsService);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  describe('processNotification', () => {
    it('test non profile UserSubscription', async () => {
      const user = await testData.createUser();
      const notification = new Notification(
        new MyTestNotification({ testProp: 'testValue', userInfo: new UserInfo(user) }),
        new SingleUserSubscription(user),
      );
      await notificationDao.save(notification);
      await processor.processNotification(notification);
      const userNotification = await userNotificationService.findOneByNotification(
        user,
        notification,
      );
      expect(userNotification).toBeDefined();
      const emailDelivery = userNotification?.getChannelDeliveryStatus('email');
      expect(emailDelivery).toBeDefined();
      expect(emailDelivery!.success).toEqual(true);
      expect(userNotification!.status.deliveredAt).toBeDefined();
    });
  });
});
