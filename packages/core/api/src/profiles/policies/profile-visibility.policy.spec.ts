import { ILyvelyTestingModule } from '@/testing';
import { ProfileVisibilityLevel } from '@lyvely/interface';
import { buildProfileTest, ProfileTestDataUtils } from '../testing';
import { LyvelyModule } from '@/core';
import { ProfileVisibilityPolicy } from './profile-visibility.policy';
import { ProfilesService } from '../services';
import { ProfileContext } from '../contexts';
import { getPolicyToken } from '../../policies';

describe('ProfileVisibilityPolicy', () => {
  let testingModule: ILyvelyTestingModule;
  let testData: ProfileTestDataUtils;
  let profileVisibilityPolicy: ProfileVisibilityPolicy;
  let profilesService: ProfilesService;

  @LyvelyModule({
    id: 'test',
    name: 'test',
    path: __dirname,
    policies: [],
  })
  class TestModule {}

  const TEST_KEY = 'profile-guard';

  beforeEach(async () => {
    testingModule = await buildProfileTest(TEST_KEY).imports([TestModule]).compile();
    testData = testingModule.get(ProfileTestDataUtils);
    profileVisibilityPolicy = testingModule.get(getPolicyToken(ProfileVisibilityPolicy));
    profilesService = testingModule.get(ProfilesService);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  it('should be defined', () => {
    expect(profileVisibilityPolicy).toBeDefined();
  });

  describe('canActivate()', () => {
    it('owner can see member profile', async () => {
      const { owner, profile } = await testData.createSimpleGroup(ProfileVisibilityLevel.Member);
      const context = await profilesService.findProfileContext(owner, profile);
      const canSee = await profileVisibilityPolicy.verify(context);
      expect(canSee).toEqual(true);
    });

    it('member can see member profile', async () => {
      const { member, profile } = await testData.createSimpleGroup(ProfileVisibilityLevel.Member);
      const context = await profilesService.findProfileContext(member, profile);
      const canSee = await profileVisibilityPolicy.verify(context);
      expect(canSee).toEqual(true);
    });

    it('user can not see member profile', async () => {
      const user = await testData.createUser('guest');
      const { profile } = await testData.createSimpleGroup(ProfileVisibilityLevel.Member);
      const context = await profilesService.findProfileContext(user, profile);
      const canSee = await profileVisibilityPolicy.verify(context);
      expect(canSee).toEqual(false);
    });

    it('visitor can not see member profile', async () => {
      const { profile } = await testData.createSimpleGroup(ProfileVisibilityLevel.Member);
      const canSee = await profileVisibilityPolicy.verify(new ProfileContext({ profile: profile }));
      expect(canSee).toEqual(false);
    });

    it('owner can see protected profile', async () => {
      const { owner, profile } = await testData.createSimpleGroup(ProfileVisibilityLevel.User);
      const context = await profilesService.findProfileContext(owner, profile);
      const canSee = await profileVisibilityPolicy.verify(context);
      expect(canSee).toEqual(true);
    });

    it('member can see protected profile', async () => {
      const { member, profile } = await testData.createSimpleGroup(ProfileVisibilityLevel.User);
      const context = await profilesService.findProfileContext(member, profile);
      const canSee = await profileVisibilityPolicy.verify(context);
      expect(canSee).toEqual(true);
    });

    it('user can see protected profile', async () => {
      const user = await testData.createUser('guest');
      const { profile } = await testData.createSimpleGroup(ProfileVisibilityLevel.User);
      const context = await profilesService.findProfileContext(user, profile);
      const canSee = await profileVisibilityPolicy.verify(context);
      expect(canSee).toEqual(true);
    });

    it('guest can not see protected profile', async () => {
      const { profile } = await testData.createSimpleGroup(ProfileVisibilityLevel.User);
      const canSee = await profileVisibilityPolicy.verify(new ProfileContext({ profile: profile }));
      expect(canSee).toEqual(false);
    });

    it('owner can see public profile', async () => {
      const { owner, profile } = await testData.createSimpleGroup(ProfileVisibilityLevel.Visitor);
      const context = await profilesService.findProfileContext(owner, profile);
      const canSee = await profileVisibilityPolicy.verify(context);
      expect(canSee).toEqual(true);
    });

    it('member can see protected profile', async () => {
      const { member, profile } = await testData.createSimpleGroup(ProfileVisibilityLevel.Visitor);
      const context = await profilesService.findProfileContext(member, profile);
      const canSee = await profileVisibilityPolicy.verify(context);
      expect(canSee).toEqual(true);
    });

    it('user can see protected profile', async () => {
      const user = await testData.createUser('guest');
      const { profile } = await testData.createSimpleGroup(ProfileVisibilityLevel.Visitor);
      const context = await profilesService.findProfileContext(user, profile);
      const canSee = await profileVisibilityPolicy.verify(context);
      expect(canSee).toEqual(true);
    });

    it('guest can not see protected profile', async () => {
      const { profile } = await testData.createSimpleGroup(ProfileVisibilityLevel.Visitor);
      const canSee = await profileVisibilityPolicy.verify(new ProfileContext({ profile: profile }));
      expect(canSee).toEqual(true);
    });
  });
});
