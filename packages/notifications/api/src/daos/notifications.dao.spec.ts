import { TestingModule } from '@nestjs/testing';
import { buildTest } from '@lyvely/testing';
import { Notification as NotificationDecorator } from '../decorators';
import { Notification, NotificationContext, NotificationType, RenderFormat } from '../schemas';
import { SingleUserSubscription } from '@lyvely/user-subscriptions';
import { ProfileInfo, ProfileTestDataUtils, profilesTestPlugin } from '@lyvely/profiles';
import { UserInfo } from '@lyvely/users';
import { NotificationDao } from './notification.dao';
import { Prop } from '@nestjs/mongoose';
import { i18nTestPlugin, Translatable } from '@lyvely/i18n';
import { escapeHtmlIf, UrlRoute } from '@lyvely/common';
import { TestNotificationCategory } from '../notifications';
import { notificationTestPlugin } from '../testing/notification-test.plugin';
import { mailTestPlugin } from '@lyvely/mails';

const TEST_KEY = 'NotificationDao';

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

describe('NotificationDao', () => {
  let testingModule: TestingModule;
  let notificationDao: NotificationDao;
  let testData: ProfileTestDataUtils;

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY)
      .plugins([profilesTestPlugin, notificationTestPlugin])
      .compile();
    notificationDao = testingModule.get(NotificationDao);
    testData = testingModule.get(ProfileTestDataUtils);
  });

  it('should be defined', () => {
    expect(notificationDao).toBeDefined();
  });

  describe('create', () => {
    it('assure created data is valid', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const notification = (await notificationDao.save(
        new Notification(
          new MyTestNotification({
            userInfo: new UserInfo(user),
            profileInfo: new ProfileInfo(profile),
          }),
          new SingleUserSubscription(user),
        ),
      )) as Notification<MyTestNotification>;
      expect(notification).toBeDefined();
      expect(notification.data instanceof MyTestNotification).toEqual(true);
      expect(notification.data.type).toEqual(MyTestNotification.typeName);
      expect(notification.data.profileInfo!.pid).toEqual(profile._id);
      expect(notification.data.profileInfo!.name).toEqual(profile.name);
      expect(notification.data.userInfo!.name).toEqual(user.getDisplayName());
      expect(notification.data.userInfo!.uid).toEqual(user._id);
      expect(notification.sortOrder <= Date.now()).toBeDefined();
      expect(notification.sortOrder >= Date.now() - 1000).toBeDefined();
      expect(notification.subscription instanceof SingleUserSubscription).toEqual(true);
      expect(notification.subscription.type).toEqual(SingleUserSubscription.typeName);
    });

    it('assure extra properties are saved', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const notification = (await notificationDao.save(
        new Notification(
          new MyTestNotification({
            userInfo: new UserInfo(user),
            profileInfo: new ProfileInfo(profile),
            testProp: 'testValue',
          }),
          new SingleUserSubscription(user),
        ),
      )) as Notification<MyTestNotification>;
      expect(notification).toBeDefined();
      expect(notification.data instanceof MyTestNotification).toEqual(true);
      expect(notification.data.testProp).toEqual('testValue');
    });

    it('assure non props are not saved', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const notification = (await notificationDao.save(
        new Notification(
          new MyTestNotification({
            userInfo: new UserInfo(user),
            profileInfo: new ProfileInfo(profile),
            testProp: 'testValue',
            nonProp: 'nonProp',
          }),
          new SingleUserSubscription(user),
        ),
      )) as Notification<MyTestNotification>;
      expect(notification).toBeDefined();
      expect(notification.data instanceof MyTestNotification).toEqual(true);
      expect(notification.data.testProp).toEqual('testValue');
      expect(notification.data.nonProp).toBeUndefined();
    });
  });
});
