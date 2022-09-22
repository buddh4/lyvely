import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { ProfilesService } from '../services';
import { BaseMembershipRole } from '@lyvely/common';
import { TestDataUtils } from '../../test/utils/test-data.utils';
import { createContentTestingModule } from '../../test/utils/test.utils';

describe('ProfileService', () => {
  let testingModule: TestingModule;
  let profileService: ProfilesService;
  let testData: TestDataUtils;

  const TEST_KEY = 'profile_service';

  beforeEach(async () => {
    testingModule = await createContentTestingModule(TEST_KEY).compile();
    profileService = testingModule.get<ProfilesService>(ProfilesService);
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
  });

  afterEach(async () => {
    await testData.reset(TEST_KEY);
  });

  it('should be defined', () => {
    expect(profileService).toBeDefined();
  });

  describe('findUserProfileRelations()', () => {
    it('find owner membership', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const relations = await profileService.findUserProfileRelations(user, profile);
      const membership = relations.getMembership();
      expect(membership).toBeDefined();
      expect(membership.role).toEqual(BaseMembershipRole.Owner);
      expect(membership.pid).toEqual(profile._id);
      expect(membership.uid).toEqual(user._id);
    });

    it('find by profile id', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const relations = await profileService.findUserProfileRelations(user, profile.id);
      expect(relations.profile).toBeDefined();
      expect(relations.profile._id).toEqual(profile._id);
    });

    it('find non membership relation', async () => {
      const { profile } = await testData.createUserAndProfile();
      const user2 = await testData.createUser('User2');
      const relations = await profileService.findUserProfileRelations(user2, profile);
      const membership = relations.getMembership();
      expect(membership).not.toBeDefined();
    });
  });

  describe('update score', () => {
    it('increment positive', async () => {
      const user = await testData.createUser();
      const  { profile } = await profileService.createUserProfile(user, { name: 'superProfile' });
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
      const  { profile } = await profileService.createUserProfile(user, { name: 'superProfile' });
      await profileService.incrementScore(profile, 5);
      const updated = await profileService.incrementScore(profile, -10);
      expect(updated).toEqual(0);
      expect(profile.score).toEqual(0);
    });
  });
});
