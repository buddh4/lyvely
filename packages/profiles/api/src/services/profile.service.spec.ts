import { ProfilesService } from './index';
import { BaseMembershipRole } from '@lyvely/profiles-interface';
import { buildTest, LyvelyTestingModule } from '@lyvely/testing';
import { profilesTestPlugin, ProfileTestDataUtils } from '../testing';

describe('ProfileService', () => {
  let testingModule: LyvelyTestingModule;
  let profileService: ProfilesService;
  let testData: ProfileTestDataUtils;

  const TEST_KEY = 'profile_service';

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY).plugins([profilesTestPlugin]).compile();
    profileService = testingModule.get<ProfilesService>(ProfilesService);
    testData = testingModule.get(ProfileTestDataUtils);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  it('should be defined', () => {
    expect(profileService).toBeDefined();
  });

  describe('findProfileContext()', () => {
    it('find owner membership', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const relations = await profileService.findProfileContext(user, profile);
      const membership = relations.getMembership();
      expect(membership).toBeDefined();
      expect(membership?.role).toEqual(BaseMembershipRole.Owner);
      expect(membership?.pid).toEqual(profile._id);
      expect(membership?.uid).toEqual(user._id);
    });

    it('find by profile id', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const relations = await profileService.findProfileContext(user, profile.id);
      expect(relations?.profile).toBeDefined();
      expect(relations?.profile._id).toEqual(profile._id);
    });

    it('find non membership relation', async () => {
      const { profile } = await testData.createUserAndProfile();
      const user2 = await testData.createUser('User2');
      const relations = await profileService.findProfileContext(user2, profile);
      const membership = relations.getMembership();
      expect(membership).not.toBeDefined();
    });
  });

  describe('update score', () => {
    it('increment positive', async () => {
      const user = await testData.createUser();
      const { profile } = await profileService.createUserProfile(user, { name: 'superProfile' });
      const newScore = await profileService.incrementScore(profile, 5);
      expect(newScore).toEqual(5);
      expect(profile.score).toEqual(5);
    });

    it('increment negative', async () => {
      const user = await testData.createUser();
      const { profile } = await profileService.createUserProfile(user, { name: 'superProfile' });
      await profileService.incrementScore(profile, 5);
      const updated = await profileService.incrementScore(profile, -2);
      expect(updated).toEqual(3);
      expect(profile.score).toEqual(3);
    });

    it('assert min 0 score', async () => {
      const user = await testData.createUser();
      const { profile } = await profileService.createUserProfile(user, { name: 'superProfile' });
      await profileService.incrementScore(profile, 5);
      const updated = await profileService.incrementScore(profile, -10);
      expect(updated).toEqual(0);
      expect(profile.score).toEqual(0);
    });
  });
});
