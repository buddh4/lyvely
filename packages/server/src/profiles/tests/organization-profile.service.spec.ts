import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { ProfilesService } from '../services';
import {
  ProfileType,
  BaseMembershipRole,
  BaseUserProfileRelationType,
  UniqueConstraintException,
} from '@lyvely/common';
import { TestDataUtils, createContentTestingModule } from '@/test';
import { Organization, UserProfileRelation } from '../schemas';

describe('ProfileService (Organization)', () => {
  let testingModule: TestingModule;
  let profileService: ProfilesService;
  let testData: TestDataUtils;

  const TEST_KEY = 'profile_service_organization';

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

  describe('createGroupProfile()', () => {
    it('create organization', async () => {
      const user = await testData.createUser('User1');
      const { profile, relations } = await profileService.createOrganization(user, { name: 'SomeOrganization' });
      expect(profile).toBeDefined();
      expect(profile instanceof Organization).toEqual(true);
      expect(profile.ownerId).toEqual(user._id);
      expect(profile.oid).toEqual(profile._id);
      expect(profile.type).toEqual(ProfileType.Organization);
      expect(profile.name).toEqual('SomeOrganization');
      expect(profile.hasOrg).toEqual(false);
      expect(profile.meta).toBeDefined();
      expect(profile.meta.archivable).toEqual(true);
      expect(profile.meta.deletable).toEqual(true);
      expectOwnerRelationship(relations);
    });

    it('assure organization can not have an organization', async () => {
      const { owner, organization } = await testData.createSimpleOrganization();
      const { profile, relations } = await profileService.createOrganization(owner, <any>{
        name: 'SomeOrganization',
        oid: organization._id,
        organization: organization,
      });

      expect(profile).toBeDefined();
      expect(profile instanceof Organization).toEqual(true);
      expect(profile.oid).not.toEqual(organization._id);
      expect(profile.type).toEqual(ProfileType.Organization);
      expect(profile.name).toEqual('SomeOrganization');
      expect(profile.hasOrg).toEqual(false);
      expect(profile._id).toEqual(profile.oid);
      expectOwnerRelationship(relations);
    });

    it('PRO_PO07: organization name is globally unique', async () => {
      const user = await testData.createUser('User1');
      await profileService.createOrganization(user, { name: 'SomeOrganization' });

      const user2 = await testData.createUser('User2');
      expect.assertions(2);
      return profileService.createOrganization(user2, { name: 'SomeOrganization' }).catch((e) => {
        expect(e instanceof UniqueConstraintException).toEqual(true);
        expect(e.getField()).toEqual('name');
      });
    });

    it('PRO_PO08: organization name is unique per owner', async () => {
      const user = await testData.createUser('User1');
      await profileService.createUserProfile(user, { name: 'SomeOrganization' });

      expect.assertions(2);
      return profileService.createOrganization(user, { name: 'SomeOrganization' }).catch((e) => {
        expect(e instanceof UniqueConstraintException).toEqual(true);
        expect(e.getField()).toEqual('name');
      });
    });
  });

  function expectOwnerRelationship(relations: UserProfileRelation[]) {
    expect(relations.length).toEqual(1);
    expect(relations[0].type).toEqual(BaseUserProfileRelationType.Membership);
    expect(relations[0].role).toEqual(BaseMembershipRole.Owner);
  }
});
