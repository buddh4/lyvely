import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { ProfilesService } from '../services';
import { ProfileType } from 'lyvely-common';
import { BaseMembershipRole } from '../schemas';
import { TestDataUtils } from '../../test/utils/test-data.utils';
import { createTestingModule } from '../../test/utils/test.utils';

describe('ProfileService', () => {
  let testingModule: TestingModule;
  let profileService: ProfilesService;
  let testData: TestDataUtils;

  const TEST_KEY = 'profile_service';

  beforeEach(async () => {
    testingModule = await createTestingModule(TEST_KEY).compile();

    profileService = testingModule.get<ProfilesService>(ProfilesService);
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
  });

  afterEach(async () => {
    await testData.reset(TEST_KEY);
  });

  it('should be defined', () => {
    expect(profileService).toBeDefined();
  });

  describe('createProfile()', () => {
    it('create default profile', async () => {
      const user = await testData.createUser('User1');
      const { profile } = await profileService.createProfile(user);
      expect(profile).toBeDefined();
      expect(profile.name).toEqual('User1');
      expect(profile.type).toEqual(ProfileType.User);
      expect(profile.categories).toBeDefined();
      expect(profile.categories.length).toEqual(0);
    });

    it('create named profile', async () => {
      const user = await testData.createUser();
      const { profile } = await profileService.createProfile(user, { name: 'superProfile' });
      expect(profile).toBeDefined();
      expect(profile.name).toEqual('superProfile');
      expect(profile._id).toBeDefined();
      expect(profile.score).toEqual(0);
    });

    it('create duplicate profile', async () => {
      const user = await testData.createUser();
      const { profile: profile1 } = await profileService.createProfile(user, { name: 'superProfile' });
      const { profile: profile2 } = await profileService.createProfile(user, { name:'superProfile' });
      expect(profile1._id.toString()).toEqual(profile2._id.toString());
    });
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
      const  { profile } = await profileService.createProfile(user, { name: 'superProfile' });
      const newScore = await profileService.updateScore(profile, 5);
      expect(newScore).toEqual(5);
      expect(profile.score).toEqual(5);
    });

    it('increment negative', async () => {
      const user = await testData.createUser();
      const { profile } = await profileService.createProfile(user, { name: 'superProfile' });
      await profileService.updateScore(profile, 5);
      const updated = await profileService.updateScore(profile, -2);
      expect(updated).toEqual(3);
      expect(profile.score).toEqual(3);
    });

    it('assert min 0 score', async () => {
      const user = await testData.createUser();
      const  { profile } = await profileService.createProfile(user, { name: 'superProfile' });
      await profileService.updateScore(profile, 5);
      const updated = await profileService.updateScore(profile, -10);
      expect(updated).toEqual(0);
      expect(profile.score).toEqual(0);
    });
  });

  describe('mergeCategories', () => {
    it('create from empty', async () => {
      const user = await testData.createUser();
      const { profile } = await profileService.createProfile(user, { name: 'superProfile' });
      await profileService.mergeCategories(profile, ['health', 'social']);
      expect(profile.categories.length).toEqual(2);
      expect(profile.categories[0].name).toEqual('health');
      expect(profile.categories[1].name).toEqual('social');
    });

    it('add to existing set', async () => {
      const user = await testData.createUser();
      const { profile } = await profileService.createProfile(user, { name: 'superProfile' });
      await profileService.mergeCategories(profile, ['social']);
      await profileService.mergeCategories(profile, ['health']);
      expect(profile.categories.length).toEqual(2);
      expect(profile.categories[0].name).toEqual('social');
      expect(profile.categories[1].name).toEqual('health');
    });

    it('add duplicate set', async () => {
      const user = await testData.createUser();
      const { profile } = await profileService.createProfile(user, { name: 'superProfile' });
      await profileService.mergeCategories(profile, ['social']);
      await profileService.mergeCategories(profile, [
        'health',
        'social',
        'health',
      ]);
      expect(profile.categories.length).toEqual(2);
      expect(profile.categories[0].name).toEqual('social');
      expect(profile.categories[1].name).toEqual('health');
    });

    it('add empty set to existing', async () => {
      const user = await testData.createUser();
      const { profile } = await profileService.createProfile(user, { name: 'superProfile' });
      await profileService.mergeCategories(profile, ['social']);
      await profileService.mergeCategories(profile, []);
      expect(profile.categories.length).toEqual(1);
      expect(profile.categories[0].name).toEqual('social');
    });

    it('add empty set to empty', async () => {
      const user = await testData.createUser();
      const { profile } = await profileService.createProfile(user, { name: 'superProfile' });
      await profileService.mergeCategories(profile, []);
      expect(profile.categories.length).toEqual(0);
    });

    it('do not accept empty category name string', async () => {
      const user = await testData.createUser();
      const { profile } = await profileService.createProfile(user, { name: 'superProfile' });
      await profileService.mergeCategories(profile, ['']);
      expect(profile.categories.length).toEqual(0);
    });
  });
});
