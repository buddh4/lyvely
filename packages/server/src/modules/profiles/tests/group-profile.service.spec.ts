import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { ProfilesService } from '../services';
import { ProfileType, BaseMembershipRole, BaseUserProfileRelationType } from '@lyvely/common';
import { TestDataUtils } from '../../test/utils/test-data.utils';
import { createContentTestingModule } from '../../test/utils/test.utils';
import { GroupProfile, UserProfileRelation } from '../schemas';
import { UniqueConstraintException } from '../../core/exceptions';

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

  describe('createGroupProfile()', () => {
    it('create named group profile', async () => {
      const user = await testData.createUser('User1');
      const { profile, relations } = await profileService.createGroupProfile(user, { name: 'SomeGroupProfile' });
      expect(profile).toBeDefined();
      expect(profile instanceof GroupProfile).toEqual(true);
      expect(profile.type).toEqual(ProfileType.Group);
      expectOwnerRelationship(relations);
    });

    it('create organization group profile', async () => {
      const { owner, organization } = await testData.createSimpleOrganization();
      const { profile, relations } = await profileService.createGroupProfile(owner, {
        name: 'OwnerProfile',
        organization: organization,
      });

      expect(profile.name).toEqual('OwnerProfile');
      expect(profile.locale).toEqual(organization.locale);
      expect(profile.ownerId).toEqual(owner._id);
      expect(profile.type).toEqual(ProfileType.Group);
      expect(profile.hasOrg).toEqual(true);
      expect(profile.oid).not.toEqual(profile._id);
      expect(profile.oid).toEqual(organization._id);
      expect(profile.meta).toBeDefined();
      expect(profile.meta.archivable).toEqual(true);
      expect(profile.meta.deletable).toEqual(true);
      expectOwnerRelationship(relations);
    });

    it('PRO_PO04: group profile name is unique per user', async () => {
      const user = await testData.createUser('User1');
      await profileService.createGroupProfile(user, { name: 'Some Profile' });

      expect.assertions(2);
      return profileService.createGroupProfile(user, { name: 'Some Profile' }).catch((e) => {
        expect(e instanceof UniqueConstraintException).toEqual(true);
        expect(e.getField()).toEqual('name');
      });
    });

    it('PRO_PO05: group profile name is unique per organization', async () => {
      const { owner, member, organization } = await testData.createSimpleOrganization();

      await profileService.createGroupProfile(owner, { organization: organization, name: 'UniqueGroupProfileName' });

      expect.assertions(2);
      return profileService
        .createGroupProfile(member, { organization: organization, name: 'UniqueGroupProfileName' })
        .catch((e) => {
          expect(e instanceof UniqueConstraintException).toEqual(true);
          expect(e.getField()).toEqual('name');
        });
    });

    it('PRO_PO06: organization group profile can not have same name as organization', async () => {
      const { member, organization } = await testData.createSimpleOrganization('MyOrganization');

      expect.assertions(2);
      return profileService
        .createGroupProfile(member, { organization: organization, name: 'MyOrganization' })
        .catch((e) => {
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
