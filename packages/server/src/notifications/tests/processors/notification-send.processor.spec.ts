import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { createBasicTestingModule, TestDataUtils } from '@/test';
import { NotificationDao } from '@/notifications/daos';
import { Notification } from '@/notifications/schemas';
import { SingleUserSubscription } from '@/user-subscription';
import { TestNotification } from '@/notifications/tests/src/test-notification.schema';
import { NotificationSenderProcessor } from '@/notifications/processors/notification-sender.processor';

const TEST_KEY = 'NotificationSendProcessor';

describe('NotificationSendProcessor', () => {
  let testingModule: TestingModule;
  let notificationDao: NotificationDao;
  let testData: TestDataUtils;
  let processor: NotificationSenderProcessor;

  beforeEach(async () => {
    testingModule = await createBasicTestingModule(TEST_KEY, [], [], []).compile();
    notificationDao = testingModule.get(NotificationDao);
    testData = testingModule.get(TestDataUtils);
    processor = testingModule.get(NotificationSenderProcessor);
  });

  afterEach(async () => {
    await testData.reset(TEST_KEY);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  describe('processNotification', () => {
    it('test non profile UserSubscription', async () => {
      const user = await testData.createUser();
      const notification = new Notification(
        new TestNotification({ testProp: 'testValue' }),
        new SingleUserSubscription(user),
      );
      await notificationDao.save(notification);
      await processor.processNotification(notification);
    });
  });
});
