import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { ProfilesService } from '../services';
import { ProfileType } from '@lyvely/common';
import { TestDataUtils } from '../../test/utils/test-data.utils';
import { createContentTestingModule } from '../../test/utils/test.utils';
import { BaseMembershipRole, BaseUserProfileRelationType, UserProfile, UserProfileRelation } from "../schemas";
import { UniqueIntegrityExistsException } from "../../../core/exceptions";

describe('ProfileService (Group)', () => {
  let testingModule: TestingModule;
  let profileService: ProfilesService;
  let testData: TestDataUtils;

  const TEST_KEY = 'profile_service_group';

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

  describe('createUserProfile()', () => {
    it('create default user profile', async () => {
      const user = await testData.createUser('User1');
      const { profile, relations } = await profileService.createUserProfile(user, { name: 'SomeProfile' });
      expect(profile).toBeDefined();
      expect(profile instanceof UserProfile).toEqual(true);
      expect(profile.type).toEqual(ProfileType.User);
      expectOwnerRelationship(relations);
    });

    it('can not create user profile with already existing name', async () => {
      const user = await testData.createUser('User1');
      await profileService.createUserProfile(user, { name: 'Some Profile' });

      expect.assertions(1);
      return profileService.createUserProfile(user, { name: 'Some Profile' }).catch(e => {
        expect(e instanceof UniqueIntegrityExistsException).toEqual(true);
      });
    })
  });

  function expectOwnerRelationship(relations: UserProfileRelation[]) {
    expect(relations.length).toEqual(1);
    expect(relations[0].type).toEqual(BaseUserProfileRelationType.Membership);
    expect(relations[0].role).toEqual(BaseMembershipRole.Owner);
  }
});
