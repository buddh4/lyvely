import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { createBasicTestingModule, TestDataUtils } from '@/test';
import { UserNotificationsService } from '@/notifications/services/user-notifications.service';
import { MultiUserSubscription } from '@/user-subscription';
import { UserNotification, Notification, NotificationType, RenderFormat } from '@/notifications';
import { Profile, ProfileInfo, UserContext } from '@/profiles';
import { User, UserInfo } from '@/users';
import { assureObjectId } from '@/core';
import { NotificationDao, UserNotificationDao } from '@/notifications/daos';
import { escapeHtmlIf, StreamRequest, UrlRoute } from '@lyvely/common';
import { Notification as NotificationDecorator } from '@/notifications/decorators';
import { Prop } from '@nestjs/mongoose';
import { Translatable } from '@/i18n';
import { TestNotificationCategory } from '@/notifications/models';

const TEST_KEY = 'UserNotificationsService';

@NotificationDecorator()
export class MyTestNotification extends NotificationType<MyTestNotification> {
  @Prop()
  testProp: string;

  nonProp: string;

  getBody(format: RenderFormat): Translatable {
    return {
      key: 'test.notification.body',
      params: {
        user: escapeHtmlIf(this.userInfo?.name, format === RenderFormat.HTML),
      },
    };
  }

  getTitle(format: RenderFormat): Translatable {
    return { key: 'test.notification.title' };
  }

  getUrl(): UrlRoute {
    return undefined;
  }

  getCategory(): string {
    return TestNotificationCategory.ID;
  }
}

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

  async function createTestNotification(
    user: User,
    profile: Profile,
    uids: TObjectId[],
    sortOrder?: number,
  ) {
    const notification = new Notification(
      new MyTestNotification({
        userInfo: new UserInfo(user),
        profileInfo: new ProfileInfo(profile),
      }),
      new MultiUserSubscription(uids),
    );

    if (sortOrder) {
      notification.sortOrder = sortOrder;
    }

    return notificationDao.save(notification);
  }

  async function createTestUserNotification(user: User, notification: Notification) {
    return userNotificationDao.save(new UserNotification(user, notification));
  }

  describe('loadTail', () => {
    it('load initial with empty result', async () => {
      const user = await testData.createUser();
      const result = await userNotificationsService.loadTail(
        new UserContext(user),
        new StreamRequest({ batchSize: 5 }),
      );
      expect(result.models.length).toEqual(0);
      expect(result.state.headIds).toBeUndefined();
      expect(result.state.head).toBeUndefined();
      expect(result.state.tail).toBeUndefined();
      expect(result.state.tailIds).toBeUndefined();
      expect(result.state.isEnd).toEqual(true);
      expect(result.hasMore).toEqual(false);
    });

    it('load initial as last result', async () => {
      const receiver = await testData.createUser();
      const sender = await testData.createUser('test2');
      const profile = await testData.createProfile(sender);
      const notification = await createTestNotification(sender, profile, [
        assureObjectId(receiver),
      ]);
      const userNotification = await createTestUserNotification(receiver, notification);
      const result = await userNotificationsService.loadTail(
        new UserContext(receiver),
        new StreamRequest({ batchSize: 5 }),
      );
      expect(result.models.length).toEqual(1);
      expect(result.state.headIds).toEqual([userNotification.id]);
      expect(result.state.head).toEqual(userNotification.sortOrder);
      expect(result.state.tail).toEqual(userNotification.sortOrder);
      expect(result.state.tailIds).toEqual([userNotification.id]);
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
      const result = await userNotificationsService.loadTail(
        new UserContext(receiver),
        new StreamRequest({ batchSize: 2 }),
      );
      expect(result.models.length).toEqual(2);
      expect(result.state.headIds).toEqual([userNotification3.id]);
      expect(result.state.head).toEqual(userNotification3.sortOrder);
      expect(result.state.tail).toEqual(userNotification2.sortOrder);
      expect(result.state.tailIds).toEqual([userNotification2.id]);
      expect(result.state.isEnd).toEqual(false);
      expect(result.hasMore).toEqual(true);
    });
  });

  describe('loadTail', () => {
    it('update entries with existing state', async () => {
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
      const result = await userNotificationsService.loadHead(
        new UserContext(receiver),
        new StreamRequest({
          batchSize: 2,
          state: {
            headIds: [userNotification1.id],
            head: userNotification1.sortOrder,
            tailIds: [userNotification1.id],
            tail: userNotification1.sortOrder,
          },
        }),
      );

      expect(result.models.length).toEqual(2);
      expect(result.models[0].id).toEqual(userNotification3.id);
      expect(result.models[1].id).toEqual(userNotification2.id);

      expect(result.state.headIds).toEqual([userNotification3.id]);
      expect(result.state.head).toEqual(userNotification3.sortOrder);
      expect(result.state.tail).toEqual(userNotification1.sortOrder);
      expect(result.state.tailIds).toEqual([userNotification1.id]);
      expect(result.hasMore).toEqual(true);
    });
  });
});
