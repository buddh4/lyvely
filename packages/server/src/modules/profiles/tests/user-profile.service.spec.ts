import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { ProfilesService } from '../services';
import { ProfileType } from '@lyvely/common';
import { TestDataUtils } from '../../test/utils/test-data.utils';
import { createContentTestingModule } from '../../test/utils/test.utils';
import { BaseMembershipRole, BaseUserProfileRelationType, UserProfile, UserProfileRelation } from "../schemas";
import { UniqueConstraintException } from "../../../core/exceptions";

describe('ProfileService (User)', () => {
  let testingModule: TestingModule;
  let profileService: ProfilesService;
  let testData: TestDataUtils;

  const TEST_KEY = 'profile_service_user';

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

  describe('createDefaultUserProfile()', () => {
    it('create default user profile', async () => {
      const user = await testData.createUser('User1');
      const { profile, relations } = await profileService.createDefaultUserProfile(user);
      expect(profile.name).toEqual(user.username);
      expect(profile.locale).toEqual(user.locale);
      expect(profile.type).toEqual(ProfileType.User);
      expect(profile.hasOrg).toEqual(false);
      expect(profile.oid).not.toEqual(profile._id);
      expect(profile.meta).toBeDefined();
      expect(profile.meta.archivable).toEqual(true);
      expect(profile.meta.deletable).toEqual(true);
      expectOwnerRelationship(relations);
    });

    it('do not create duplicate default', async () => {
      const user = await testData.createUser('User1');
      const { profile, relations } = await profileService.createDefaultUserProfile(user);
      const { profile: profile2, relations: relations2 } = await profileService.createDefaultUserProfile(user);

      expect(profile._id).toEqual(profile2._id);
      expectOwnerRelationship(relations);
      expectOwnerRelationship(relations2);
    });
  });

  describe('createUserProfile()', () => {
    it('create organization user profile', async () => {
      const { owner, organization } = await testData.createSimpleOrganization();
      const { profile, relations } = await profileService
        .createUserProfile(owner, { name: 'OwnerProfile', organization: organization });

      expect(profile.name).toEqual('OwnerProfile');
      expect(profile.locale).toEqual(organization.locale);
      expect(profile.ownerId).toEqual(owner._id);
      expect(profile.type).toEqual(ProfileType.User);
      expect(profile.hasOrg).toEqual(true);
      expect(profile.oid).not.toEqual(profile._id);
      expect(profile.oid).toEqual(organization._id);
      expect(profile.meta).toBeDefined();
      expect(profile.meta.archivable).toEqual(true);
      expect(profile.meta.deletable).toEqual(true);
      expectOwnerRelationship(relations);
    });

    it('create named user profile', async () => {
      const user = await testData.createUser('User1');
      const { profile, relations } = await profileService.createUserProfile(user, { name: 'SomeProfile' });
      expect(profile).toBeDefined();
      expect(profile instanceof UserProfile).toEqual(true);
      expect(profile.type).toEqual(ProfileType.User);
      expectOwnerRelationship(relations);
    });

    it('PRO_PO01: user profile name is unique per user', async () => {
      const user = await testData.createUser('User1');
      await profileService.createUserProfile(user, { name: 'Some Profile' });

      expect.assertions(2);
      return profileService.createUserProfile(user, { name: 'Some Profile' }).catch(e => {
        expect(e instanceof UniqueConstraintException).toEqual(true);
        expect(e.getField()).toEqual('name');
      });
    });

    it('PRO_PO02: user profile name is unique per organization', async () => {
      const { owner, member, organization }  = await testData.createSimpleOrganization();

      await profileService.createUserProfile(owner, { organization: organization, name: 'UniqueProfileName' });

      expect.assertions(2);
      return profileService.createUserProfile(member, { organization: organization, name: 'UniqueProfileName' }).catch(e => {
        expect(e instanceof UniqueConstraintException).toEqual(true);
        expect(e.getField()).toEqual('name');
      });
    })

    it('PRO_PO03: organization user profile can not have same name as organization', async () => {
      const { member, organization }  = await testData.createSimpleOrganization('MyOrganization');

      expect.assertions(2);
      return profileService.createUserProfile(member, { organization: organization, name: 'MyOrganization' }).catch(e => {
        expect(e instanceof UniqueConstraintException).toEqual(true);
        expect(e.getField()).toEqual('name');
      });
    })
  });

  function expectOwnerRelationship(relations: UserProfileRelation[]) {
    expect(relations.length).toEqual(1);
    expect(relations[0].type).toEqual(BaseUserProfileRelationType.Membership);
    expect(relations[0].role).toEqual(BaseMembershipRole.Owner);
  }
});
