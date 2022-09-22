import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { createActivityTestingModule } from '../../../activities/tests/utils/activities.test.utils';
import { TestDataUtils } from '../../../test/utils/test-data.utils';
import { createTestExecutionContext } from '../../../test/utils/test-execution-context.util';
import { ProfileGuard } from '../../guards';
import { ProfileRequest } from '../../../core/types';
import { ProfileVisibilityLevel, BaseMembershipRole } from '@lyvely/common';

describe('ProfileGuard', () => {
  let testingModule: TestingModule;
  let profileGuard: ProfileGuard;
  let testData: TestDataUtils;

  const TEST_KEY = 'profile-guard';

  beforeEach(async () => {
    testingModule = await createActivityTestingModule(TEST_KEY,[ProfileGuard]).compile();
    profileGuard = testingModule.get<ProfileGuard>(ProfileGuard);
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
  });

  afterEach(async () => {
    await testData.reset(TEST_KEY);
  });

  it('should be defined', () => {
    expect(ProfileGuard).toBeDefined();
  });

  describe('canActivate()', () => {
    it('owner can access user profile', async () => {
      const { user: owner, profile } = await testData.createUserAndProfile();
      const executionContext = createTestExecutionContext({
        user: owner,
        query: { pid: profile._id.toString() },
      });

      const result = await profileGuard.canActivate(executionContext);
      expect(result).toEqual(true);

      const request = executionContext.switchToHttp().getRequest<ProfileRequest>();

      expect(request.profile).toBeDefined();
      expect(request.profile._id).toEqual(profile._id);
      expect(request.profileRelations).toBeDefined();
      expect(request.profileRelations.profile).toBeDefined();
      expect(request.profileRelations.user).toBeDefined();
      expect(request.profileRelations.user._id).toEqual(owner._id);
      expect(request.profileRelations.getMembership()).toBeDefined();
      expect(request.profileRelations.getMembership().role).toEqual(BaseMembershipRole.Owner);
    });

    it('member can access group profile', async () => {
      const { member, profile } = await testData.createSimpleGroup();

      const executionContext = createTestExecutionContext({
        user: member,
        query: { pid: profile._id.toString() },
      });

      const result = await profileGuard.canActivate(executionContext);
      expect(result).toEqual(true);

      const request = executionContext.switchToHttp().getRequest<ProfileRequest>();

      expect(request.profile).toBeDefined();
      expect(request.profile._id).toEqual(profile._id);
      expect(request.profileRelations).toBeDefined();
      expect(request.profileRelations.profile).toBeDefined();
      expect(request.profileRelations.user).toBeDefined();
      expect(request.profileRelations.user._id).toEqual(member._id);
      expect(request.profileRelations.getMembership()).toBeDefined();
      expect(request.profileRelations.getMembership().role).toEqual(BaseMembershipRole.Member);
    });

    it('non member user can access protected profile', async () => {
      const { profile } = await testData.createSimpleGroup(ProfileVisibilityLevel.User);
      const user = await testData.createUser('someUser');

      const executionContext = createTestExecutionContext({
        user: user,
        query: { pid: profile._id.toString() },
      });

      const result = await profileGuard.canActivate(executionContext);
      expect(result).toEqual(true);

      const request = executionContext.switchToHttp().getRequest<ProfileRequest>();

      expect(request.profile).toBeDefined();
      expect(request.profile._id).toEqual(profile._id);
      expect(request.profileRelations).toBeDefined();
      expect(request.profileRelations.profile).toBeDefined();
      expect(request.profileRelations.user).toBeDefined();
      expect(request.profileRelations.user._id).toEqual(user._id);
      expect(request.profileRelations.getMembership()).not.toBeDefined();
    });

    it('non member user can access public profile', async () => {
      const { profile } = await testData.createSimpleGroup(ProfileVisibilityLevel.Visitor);
      const user = await testData.createUser('someUser');

      const executionContext = createTestExecutionContext({
        user: user,
        query: { pid: profile._id.toString() },
      });

      const result = await profileGuard.canActivate(executionContext);
      expect(result).toEqual(true);
    });

    it('non member user can not access members only profile', async () => {
      const { profile } = await testData.createSimpleGroup(ProfileVisibilityLevel.Member);
      const user = await testData.createUser('someUser');

      const executionContext = createTestExecutionContext({
        user: user,
        query: { pid: profile._id.toString() },
      });

      const result = await profileGuard.canActivate(executionContext);
      expect(result).toEqual(false);
    });

    it('guest can access public profile', async () => {
      const { profile } = await testData.createSimpleGroup(ProfileVisibilityLevel.Visitor);

      const executionContext = createTestExecutionContext({
        query: { pid: profile._id.toString() },
      });

      const result = await profileGuard.canActivate(executionContext);
      expect(result).toEqual(true);

      const request = executionContext.switchToHttp().getRequest<ProfileRequest>();

      expect(request.profile).toBeDefined();
      expect(request.profile._id).toEqual(profile._id);
      expect(request.profileRelations).toBeDefined();
      expect(request.profileRelations.profile).toBeDefined();
      expect(request.profileRelations.user).not.toBeDefined();
      expect(request.profileRelations.isMember()).toEqual(false);
      expect(request.profileRelations.isGuest()).toEqual(true);
    });

    it('guest can not access protected profile', async () => {
      const { profile } = await testData.createSimpleGroup(ProfileVisibilityLevel.User);

      const executionContext = createTestExecutionContext({
        query: { pid: profile._id.toString() },
      });

      const result = await profileGuard.canActivate(executionContext);
      expect(result).toEqual(false);
    });

    it('guest can not access members only profile', async () => {
      const { profile } = await testData.createSimpleGroup(ProfileVisibilityLevel.Member);

      const executionContext = createTestExecutionContext({
        query: { pid: profile._id.toString() },
      });

      const result = await profileGuard.canActivate(executionContext);
      expect(result).toEqual(false);
    });

  });
});
