import { ILyvelyTestingModule } from '@/testing';
import { NotificationDao, Notification as NotificationDecorator } from '../index';
import { Notification, INotificationContext, NotificationType, RenderFormat } from '../schemas';
import { SingleUserSubscription } from '@/user-subscriptions';
import { NotificationSenderProcessor } from './notification-sender.processor';
import { UserNotificationsService } from '../services';
import { UserInfo } from '@/users';
import { Prop } from '@nestjs/mongoose';
import { Translatable } from '@/i18n';
import { UrlRoute } from '@lyvely/interface';
import { BaseModel, type BaseModelData, escapeHtmlIf } from '@lyvely/common';
import { TestNotificationCategory } from '../notifications';
import { buildProfileTest, ProfileTestDataUtils } from '@/profiles';
import { notificationITestPlugin } from '../testing';

const TEST_KEY = 'NotificationSendProcessor';

@NotificationDecorator()
export class MyTestNotification extends NotificationType {
  @Prop()
  testProp: string;

  nonProp: string;

  constructor(data: BaseModelData<MyTestNotification>) {
    super(false);
    BaseModel.init(this, data);
  }

  getBody(context: INotificationContext): Translatable {
    return {
      key: 'test.notification.body',
      params: {
        user: escapeHtmlIf(this.userInfo!.name, context.format === RenderFormat.HTML),
      },
    };
  }

  getTitle(format: INotificationContext): Translatable {
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
  let testingModule: ILyvelyTestingModule;
  let notificationDao: NotificationDao;
  let testData: ProfileTestDataUtils;
  let processor: NotificationSenderProcessor;
  let userNotificationService: UserNotificationsService;

  beforeEach(async () => {
    testingModule = await buildProfileTest(TEST_KEY).plugins([notificationITestPlugin]).compile();
    notificationDao = testingModule.get(NotificationDao);
    testData = testingModule.get(ProfileTestDataUtils);
    processor = testingModule.get(NotificationSenderProcessor);
    userNotificationService = testingModule.get(UserNotificationsService);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  describe('processNotification', () => {
    it('test non profile UserSubscription', async () => {
      const user = await testData.createUser();
      const notification = new Notification(
        new MyTestNotification({ testProp: 'testValue', userInfo: new UserInfo(user) }),
        new SingleUserSubscription(user)
      );
      await notificationDao.save(notification);
      await processor.processNotification(notification);
      const userNotification = await userNotificationService.findOneByNotification(
        user,
        notification
      );
      expect(userNotification).toBeDefined();
      const emailDelivery = userNotification?.getChannelDeliveryStatus('email');
      expect(emailDelivery).toBeDefined();
      expect(emailDelivery!.success).toEqual(true);
      expect(userNotification!.status.deliveredAt).toBeDefined();
    });
  });
});
