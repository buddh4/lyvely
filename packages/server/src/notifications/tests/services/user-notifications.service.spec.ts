import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { createBasicTestingModule, TestDataUtils } from '@/test';
import { UserNotificationsService } from '@/notifications/services/user-notifications.service';
import { TestNotification } from '../src/test-notification.schema';
import { UserNotification, Notification, UsersSubscription } from '@/notifications';
import { Profile, ProfileInfo } from '@/profiles';
import { User, UserInfo } from '@/users';
import { assureObjectId } from '@/core';
import { NotificationDao, UserNotificationDao } from '@/notifications/daos';

const TEST_KEY = 'UserNotificationsService';

describe('UserNotificationsService', () => {
  let testingModule: TestingModule;
  let userNotificationsService: UserNotificationsService;
  let notificationDao: NotificationDao;
  let userNotificationDao: UserNotificationDao;
  let testData: TestDataUtils;

  beforeEach(async () => {
    testingModule = await createBasicTestingModule(TEST_KEY, [], [], []).compile();
    userNotificationsService = testingModule.get(UserNotificationsService);
    notificationDao = testingModule.get(NotificationDao);
    userNotificationDao = testingModule.get(UserNotificationDao);
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
  });

  afterEach(async () => {
    await testData.reset(TEST_KEY);
  });

  it('should be defined', () => {
    expect(userNotificationsService).toBeDefined();
    expect(notificationDao).toBeDefined();
    expect(userNotificationDao).toBeDefined();
  });

  describe('loadNext', () => {
    it('load initial with empty result', async () => {
      const user = await testData.createUser();
      const result = await userNotificationsService.loadNext(user, { batchSize: 5 });
      expect(result.models.length).toEqual(0);
      expect(result.state.firstId).toBeUndefined();
      expect(result.state.firstOrder).toBeUndefined();
      expect(result.state.lastOrder).toBeUndefined();
      expect(result.state.lastId).toBeUndefined();
      expect(result.state.isEnd).toEqual(true);
      expect(result.hasMore).toEqual(false);
    });

    async function createTestNotification(
      user: User,
      profile: Profile,
      uids: TObjectId[],
      sortOrder?: number,
      testValue = 'test',
    ) {
      const notification = new Notification(
        new TestNotification({
          userInfo: new UserInfo(user),
          profileInfo: new ProfileInfo(profile),
        }),
        new UsersSubscription(uids),
      );

      if (sortOrder) {
        notification.sortOrder = sortOrder;
      }

      return notificationDao.save(notification);
    }

    async function createTestUserNotification(user: User, notification: Notification) {
      return userNotificationDao.save(
        new UserNotification({
          uid: user._id,
          notificationId: notification._id,
          sortOrder: notification.sortOrder,
        }),
      );
    }

    it('load initial as last result', async () => {
      const receiver = await testData.createUser();
      const sender = await testData.createUser('test2');
      const profile = await testData.createProfile(sender);
      const notification = await createTestNotification(sender, profile, [
        assureObjectId(receiver),
      ]);
      const userNotification = await createTestUserNotification(receiver, notification);
      const result = await userNotificationsService.loadNext(receiver, { batchSize: 5 });
      expect(result.models.length).toEqual(1);
      expect(result.state.firstId).toEqual(userNotification.id);
      expect(result.state.firstOrder).toEqual(userNotification.sortOrder);
      expect(result.state.lastOrder).toEqual(userNotification.sortOrder);
      expect(result.state.lastId).toEqual(userNotification.id);
      expect(result.state.isEnd).toEqual(true);
      expect(result.hasMore).toEqual(false);
    });

    it('load initial with more result', async () => {
      const receiver = await testData.createUser();
      const sender = await testData.createUser('test2');
      const profile = await testData.createProfile(sender);
      const notification1 = await createTestNotification(
        sender,
        profile,
        [assureObjectId(receiver)],
        Date.now() - 1000,
      );
      const notification2 = await createTestNotification(
        sender,
        profile,
        [assureObjectId(receiver)],
        Date.now() - 500,
      );
      const notification3 = await createTestNotification(
        sender,
        profile,
        [assureObjectId(receiver)],
        Date.now() - 200,
      );
      const userNotification1 = await createTestUserNotification(receiver, notification1);
      const userNotification2 = await createTestUserNotification(receiver, notification2);
      const userNotification3 = await createTestUserNotification(receiver, notification3);
      const result = await userNotificationsService.loadNext(receiver, { batchSize: 2 });
      expect(result.models.length).toEqual(2);
      expect(result.state.firstId).toEqual(userNotification1.id);
      expect(result.state.firstOrder).toEqual(userNotification1.sortOrder);
      expect(result.state.lastOrder).toEqual(userNotification2.sortOrder);
      expect(result.state.lastId).toEqual(userNotification2.id);
      expect(result.state.isEnd).toEqual(false);
      expect(result.hasMore).toEqual(true);
    });
  });
});