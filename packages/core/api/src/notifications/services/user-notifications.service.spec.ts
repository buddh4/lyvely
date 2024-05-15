import { ILyvelyTestingModule } from '@/testing';
import { UserNotificationsService } from './user-notifications.service';
import { MultiUserSubscription } from '@/user-subscriptions';
import {
  UserNotification,
  NotificationType,
  RenderFormat,
  INotificationContext,
  Notification,
} from '../index';
import { buildProfileTest, Profile, ProfileInfo, ProfileTestDataUtils } from '@/profiles';
import { User, UserInfo } from '@/users';
import { assureObjectId, TObjectId } from '@/core';
import { NotificationDao, UserNotificationDao } from '../daos';
import { UrlRoute, StreamRequest } from '@lyvely/interface';
import { escapeHtmlIf } from '@lyvely/common';
import { Prop } from '@nestjs/mongoose';
import { Notification as BaseNotification } from '../schemas';
import { Translatable } from '@/i18n';
import { TestNotificationCategory } from '../notifications';
import { notificationITestPlugin } from '../testing';

const TEST_KEY = 'UserNotificationsService';

@Notification()
export class MyTestNotification extends NotificationType {
  @Prop()
  testProp: string;

  nonProp: string;

  getBody(ctx: INotificationContext): Translatable {
    return {
      key: 'test.notification.body',
      params: {
        user: escapeHtmlIf(this.userInfo!.name, ctx.format === RenderFormat.HTML),
      },
    };
  }

  getTitle(): Translatable {
    return { key: 'test.notification.title' };
  }

  getUrl(): UrlRoute | null {
    return null;
  }

  getCategory(): string {
    return TestNotificationCategory.ID;
  }
}

describe('UserNotificationsService', () => {
  let testingModule: ILyvelyTestingModule;
  let userNotificationsService: UserNotificationsService;
  let notificationDao: NotificationDao;
  let userNotificationDao: UserNotificationDao;
  let testData: ProfileTestDataUtils;

  beforeEach(async () => {
    testingModule = await buildProfileTest(TEST_KEY).plugins([notificationITestPlugin]).compile();
    userNotificationsService = testingModule.get(UserNotificationsService);
    notificationDao = testingModule.get(NotificationDao);
    userNotificationDao = testingModule.get(UserNotificationDao);
    testData = testingModule.get(ProfileTestDataUtils);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
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
    const notification = new BaseNotification(
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

  async function createTestUserNotification(user: User, notification: BaseNotification) {
    return userNotificationDao.save(new UserNotification(user, notification));
  }

  describe('loadTail', () => {
    it('load initial with empty result', async () => {
      const user = await testData.createUser();
      const result = await userNotificationsService.loadTail(
        { user },
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
        { user: receiver },
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
        { user: receiver },
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
        { user: receiver },
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
