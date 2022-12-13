import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { createBasicTestingModule, TestDataUtils } from '@/test';
import { TestNotification } from '../src/test-notification.schema';
import { Notification, UserSubscription } from '@/notifications';
import { ProfileInfo } from '@/profiles';
import { UserInfo } from '@/users';
import { NotificationDao } from '@/notifications/daos';

const TEST_KEY = 'NotificationDao';

describe('NotificationDao', () => {
  let testingModule: TestingModule;
  let notificationDao: NotificationDao;
  let testData: TestDataUtils;

  beforeEach(async () => {
    testingModule = await createBasicTestingModule(TEST_KEY, [], [], []).compile();
    notificationDao = testingModule.get(NotificationDao);
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
  });

  afterEach(async () => {
    await testData.reset(TEST_KEY);
  });

  it('should be defined', () => {
    expect(notificationDao).toBeDefined();
  });

  describe('create', () => {
    it('assure created data is valid', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const notification = (await notificationDao.save(
        new Notification(
          new TestNotification({
            userInfo: new UserInfo(user),
            profileInfo: new ProfileInfo(profile),
          }),
          new UserSubscription(user),
        ),
      )) as Notification<TestNotification>;
      expect(notification).toBeDefined();
      expect(notification.data instanceof TestNotification).toEqual(true);
      expect(notification.data.type).toEqual(TestNotification.typeName);
      expect(notification.data.profileInfo.pid).toEqual(profile._id);
      expect(notification.data.profileInfo.name).toEqual(profile.name);
      expect(notification.data.userInfo.name).toEqual(user.getDisplayName());
      expect(notification.data.userInfo.uid).toEqual(user._id);
      expect(notification.sortOrder <= Date.now()).toBeDefined();
      expect(notification.sortOrder >= Date.now() - 1000).toBeDefined();
      expect(notification.subscription instanceof UserSubscription).toEqual(true);
      expect(notification.subscription.type).toEqual(UserSubscription.typeName);
    });

    it('assure extra properties are saved', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const notification = (await notificationDao.save(
        new Notification(
          new TestNotification({
            userInfo: new UserInfo(user),
            profileInfo: new ProfileInfo(profile),
            testProp: 'testValue',
          }),
          new UserSubscription(user),
        ),
      )) as Notification<TestNotification>;
      expect(notification).toBeDefined();
      expect(notification.data instanceof TestNotification).toEqual(true);
      expect(notification.data.testProp).toEqual('testValue');
    });

    it('assure non props are not saved', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const notification = (await notificationDao.save(
        new Notification(
          new TestNotification({
            userInfo: new UserInfo(user),
            profileInfo: new ProfileInfo(profile),
            testProp: 'testValue',
            nonProp: 'nonProp',
          }),
          new UserSubscription(user),
        ),
      )) as Notification<TestNotification>;
      expect(notification).toBeDefined();
      expect(notification.data instanceof TestNotification).toEqual(true);
      expect(notification.data.testProp).toEqual('testValue');
      expect(notification.data.nonProp).toBeUndefined();
    });
  });
});
