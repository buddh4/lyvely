import { buildTest, LyvelyTestingModule } from '@/testing';
import { Notification as NotificationDecorator } from '../decorators';
import { Notification, NotificationContext, NotificationType, RenderFormat } from '../schemas';
import { SingleUserSubscription } from '@/user-subscriptions';
import { ProfileInfo, ProfileTestDataUtils, profilesTestPlugin } from '@/profiles';
import { UserInfo } from '@/users';
import { NotificationDao } from './notification.dao';
import { Prop } from '@nestjs/mongoose';
import { Translatable } from '@/i18n';
import { escapeHtmlIf } from '@lyvely/common';
import { UrlRoute } from '@lyvely/interface';
import { TestNotificationCategory } from '../notifications';
import { notificationTestPlugin } from '../testing';
import { BaseDocument, type StrictBaseDocumentData } from '@/core';

const TEST_KEY = 'NotificationDao';

@NotificationDecorator()
export class MyTestNotification extends NotificationType {
  @Prop()
  testProp: string;

  nonProp: string;

  constructor(data: StrictBaseDocumentData<Omit<MyTestNotification, 'type'>>) {
    super(false);
    BaseDocument.init(this, data);
  }

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
  let testingModule: LyvelyTestingModule;
  let notificationDao: NotificationDao;
  let testData: ProfileTestDataUtils;

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY)
      .plugins([profilesTestPlugin, notificationTestPlugin])
      .compile();
    notificationDao = testingModule.get(NotificationDao);
    testData = testingModule.get(ProfileTestDataUtils);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
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
            testProp: 'testProp',
            nonProp: 'nonProb',
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
            nonProp: 'nonProb',
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
