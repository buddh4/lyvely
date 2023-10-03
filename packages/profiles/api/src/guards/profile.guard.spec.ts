import { buildTest, createTestExecutionContext, LyvelyTestingModule } from '@lyvely/testing';
import { ProfileGuard } from './index';
import { ProfileRequest } from '../types';
import { ProfileVisibilityLevel, BaseMembershipRole } from '@lyvely/profiles-interface';
import { profilesTestPlugin, ProfileTestDataUtils } from '../testing';

describe('ProfileGuard', () => {
  let testingModule: LyvelyTestingModule;
  let profileGuard: ProfileGuard;
  let testData: ProfileTestDataUtils;

  const TEST_KEY = 'profile-guard';

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY)
      .plugins([profilesTestPlugin])
      .providers([ProfileGuard])
      .compile();
    profileGuard = testingModule.get(ProfileGuard);
    testData = testingModule.get(ProfileTestDataUtils);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
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
      expect(request.context).toBeDefined();
      expect(request.context.profile).toBeDefined();
      expect(request.context.user).toBeDefined();
      expect(request.context.user._id).toEqual(owner._id);
      expect(request.context.getMembership()).toBeDefined();
      expect(request.context.getMembership()?.role).toEqual(BaseMembershipRole.Owner);
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
      expect(request.context).toBeDefined();
      expect(request.context.profile).toBeDefined();
      expect(request.context.user).toBeDefined();
      expect(request.context.user._id).toEqual(member._id);
      expect(request.context.getMembership()).toBeDefined();
      expect(request.context.getMembership()?.role).toEqual(BaseMembershipRole.Member);
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
      expect(request.context).toBeDefined();
      expect(request.context.profile).toBeDefined();
      expect(request.context.user).toBeDefined();
      expect(request.context.user._id).toEqual(user._id);
      expect(request.context.getMembership()).not.toBeDefined();
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
      expect(request.context).toBeDefined();
      expect(request.context.profile).toBeDefined();
      expect(request.context.user).not.toBeDefined();
      expect(request.context.isMember()).toEqual(false);
      expect(request.context.isUser()).toEqual(false);
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
