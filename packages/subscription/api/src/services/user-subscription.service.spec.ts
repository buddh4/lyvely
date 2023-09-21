import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { createBasicTestingModule, TestDataUtils } from '@lyvely/testing';
import {
  MultiUserSubscription,
  ProfileSubscription,
  SingleUserSubscription,
  UserSubscriptionService,
} from '@lyvely/subscription';
import { BaseUserProfileRelationType } from '@lyvely/common';

describe('UserSubscriptionService', () => {
  let testingModule: TestingModule;
  let testData: TestDataUtils;
  let userSubscriptionService: UserSubscriptionService;

  const TEST_KEY = 'UserSubscriptionService';

  beforeEach(async () => {
    testingModule = await createBasicTestingModule(TEST_KEY, [UserSubscriptionService]).compile();
    userSubscriptionService = testingModule.get(UserSubscriptionService);
    testData = testingModule.get(TestDataUtils);
  });

  it('should be defined', () => {
    expect(userSubscriptionService).toBeDefined();
  });

  describe('getSubscriptionContext()', () => {
    it('test single user subscription without profile', async () => {
      const user = await testData.createUser();
      const userContexts = await userSubscriptionService.getSubscriptionContext(
        new SingleUserSubscription(user),
      );

      expect(userContexts.length).toEqual(1);
      expect(userContexts[0].user._id).toEqual(user._id);
      expect(userContexts[0].profile).toBeUndefined();
      expect(userContexts[0].relations).toBeUndefined();
    });

    it('test single user subscription with non-member profile', async () => {
      const { profile } = await testData.createUserAndProfile();
      const user2 = await testData.createUser('user2');
      const userContexts = await userSubscriptionService.getSubscriptionContext(
        new SingleUserSubscription(user2),
        profile,
      );

      expect(userContexts.length).toEqual(1);
      expect(userContexts[0].user._id).toEqual(user2._id);
      expect(userContexts[0].profile._id).toEqual(profile._id);
      expect(userContexts[0].relations).toEqual([]);
    });

    it('test single user subscription with member profile', async () => {
      const { member, profile } = await testData.createSimpleGroup();
      const userContexts = await userSubscriptionService.getSubscriptionContext(
        new SingleUserSubscription(member),
        profile,
      );

      expect(userContexts.length).toEqual(1);
      expect(userContexts[0].user._id).toEqual(member._id);
      expect(userContexts[0].profile._id).toEqual(profile._id);
      expect(userContexts[0].relations.length).toEqual(1);
      expect(userContexts[0].relations[0].type).toEqual(BaseUserProfileRelationType.Membership);
    });

    it('test multi user subscription without profile', async () => {
      const user1 = await testData.createUser();
      const user2 = await testData.createUser('user2');
      const userContexts = await userSubscriptionService.getSubscriptionContext(
        new MultiUserSubscription([user1, user2]),
      );

      expect(userContexts.length).toEqual(2);
      expect(userContexts[0].user._id).toEqual(user1._id);
      expect(userContexts[0].profile).toBeUndefined();
      expect(userContexts[0].relations).toBeUndefined();

      expect(userContexts[1].user._id).toEqual(user2._id);
      expect(userContexts[1].profile).toBeUndefined();
      expect(userContexts[1].relations).toBeUndefined();
    });

    it('test multi user subscription with profile', async () => {
      const { member, profile } = await testData.createSimpleGroup();
      const user = await testData.createUser('user2');
      const userContexts = await userSubscriptionService.getSubscriptionContext(
        new MultiUserSubscription([member, user]),
        profile,
      );

      expect(userContexts.length).toEqual(2);
      expect(userContexts[0].user._id).toEqual(member._id);
      expect(userContexts[0].profile._id).toEqual(profile._id);
      expect(userContexts[0].relations[0].type).toEqual(BaseUserProfileRelationType.Membership);

      expect(userContexts[1].user._id).toEqual(user._id);
      expect(userContexts[0].profile._id).toEqual(profile._id);
      expect(userContexts[1].relations).toEqual([]);
    });

    it('test profile subscription without given profile', async () => {
      await testData.createSimpleGroup();
      const userContexts = await userSubscriptionService.getSubscriptionContext(
        new ProfileSubscription(),
      );
      expect(userContexts.length).toEqual(0);
    });

    it('test profile subscription with given profile', async () => {
      const { member, owner, profile } = await testData.createSimpleGroup();
      const userContexts = await userSubscriptionService.getSubscriptionContext(
        new ProfileSubscription(),
        profile,
      );

      expect(userContexts.length).toEqual(2);
      expect(userContexts[0].user._id).toEqual(owner._id);
      expect(userContexts[0].profile._id).toEqual(profile._id);
      expect(userContexts[0].relations[0].type).toEqual(BaseUserProfileRelationType.Membership);

      expect(userContexts[1].user._id).toEqual(member._id);
      expect(userContexts[1].profile._id).toEqual(profile._id);
      expect(userContexts[1].relations[0].type).toEqual(BaseUserProfileRelationType.Membership);
    });
  });
});
