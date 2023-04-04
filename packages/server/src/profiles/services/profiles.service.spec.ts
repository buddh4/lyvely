import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { ProfilesService } from './index';
import {
  ProfileType,
  BaseMembershipRole,
  BaseUserProfileRelationType,
  UniqueConstraintException,
} from '@lyvely/common';
import { createContentTestingModule, TestDataUtils } from '@/test';
import { GroupProfile, Organization, UserProfile, UserProfileRelation } from '../schemas';

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

  describe('Organization Profile', () => {
    describe('createGroupProfile()', () => {
      it('create organization', async () => {
        const user = await testData.createUser('User1');
        const { profile, relations } = await profileService.createOrganization(user, {
          name: 'SomeOrganization',
        });
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
          expect(e.data.fields[0].property).toEqual('name');
        });
      });

      it('PRO_PO08: organization name is unique per owner', async () => {
        const user = await testData.createUser('User1');
        await profileService.createUserProfile(user, { name: 'SomeOrganization' });

        expect.assertions(2);
        return profileService.createOrganization(user, { name: 'SomeOrganization' }).catch((e) => {
          expect(e instanceof UniqueConstraintException).toEqual(true);
          expect(e.data.fields[0].property).toEqual('name');
        });
      });
    });
  });

  describe('Group Profile', () => {
    it('create named group profile', async () => {
      const user = await testData.createUser('User1');
      const { profile, relations } = await profileService.createGroupProfile(user, {
        name: 'SomeGroupProfile',
      });
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

    it('group profile name is unique per user', async () => {
      const user = await testData.createUser('User1');
      await profileService.createGroupProfile(user, { name: 'Some Profile' });

      expect.assertions(2);
      return profileService.createGroupProfile(user, { name: 'Some Profile' }).catch((e) => {
        expect(e instanceof UniqueConstraintException).toEqual(true);
        expect(e.data.fields[0].property).toEqual('name');
      });
    });

    it('group profile name is unique per organization', async () => {
      const { owner, member, organization } = await testData.createSimpleOrganization();

      await profileService.createGroupProfile(owner, {
        organization: organization,
        name: 'UniqueGroupProfileName',
      });

      expect.assertions(2);
      return profileService
        .createGroupProfile(member, { organization: organization, name: 'UniqueGroupProfileName' })
        .catch((e) => {
          expect(e instanceof UniqueConstraintException).toEqual(true);
          expect(e.data.fields[0].property).toEqual('name');
        });
    });

    it('organization group profile can not have same name as organization', async () => {
      const { member, organization } = await testData.createSimpleOrganization('MyOrganization');

      expect.assertions(2);
      return profileService
        .createGroupProfile(member, { organization: organization, name: 'MyOrganization' })
        .catch((e) => {
          expect(e instanceof UniqueConstraintException).toEqual(true);
          expect(e.data.fields[0].property).toEqual('name');
        });
    });
  });

  describe('User Profile', () => {
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
        const { profile: profile2, relations: relations2 } =
          await profileService.createDefaultUserProfile(user);

        expect(profile._id).toEqual(profile2._id);
        expectOwnerRelationship(relations);
        expectOwnerRelationship(relations2);
      });
    });

    describe('createUserProfile()', () => {
      it('create organization user profile', async () => {
        const { owner, organization } = await testData.createSimpleOrganization();
        const { profile, relations } = await profileService.createUserProfile(owner, {
          name: 'OwnerProfile',
          organization: organization,
        });

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
        const { profile, relations } = await profileService.createUserProfile(user, {
          name: 'SomeProfile',
        });
        expect(profile).toBeDefined();
        expect(profile instanceof UserProfile).toEqual(true);
        expect(profile.type).toEqual(ProfileType.User);
        expectOwnerRelationship(relations);
      });

      it('user profile name is unique per user', async () => {
        const user = await testData.createUser('User1');
        await profileService.createUserProfile(user, { name: 'Some Profile' });

        expect.assertions(2);
        return profileService.createUserProfile(user, { name: 'Some Profile' }).catch((e) => {
          expect(e instanceof UniqueConstraintException).toEqual(true);
          expect(e.data.fields[0].property).toEqual('name');
        });
      });

      it('user profile name is unique per organization', async () => {
        const { owner, member, organization } = await testData.createSimpleOrganization();

        await profileService.createUserProfile(owner, {
          organization: organization,
          name: 'UniqueProfileName',
        });

        expect.assertions(2);
        return profileService
          .createUserProfile(member, { organization: organization, name: 'UniqueProfileName' })
          .catch((e) => {
            expect(e instanceof UniqueConstraintException).toEqual(true);
            expect(e.data.fields[0].property).toEqual('name');
          });
      });

      it('organization user profile can not have same name as organization', async () => {
        const { member, organization } = await testData.createSimpleOrganization('MyOrganization');

        expect.assertions(2);
        return profileService
          .createUserProfile(member, { organization: organization, name: 'MyOrganization' })
          .catch((e) => {
            expect(e instanceof UniqueConstraintException).toEqual(true);
            expect(e.data.fields[0].property).toEqual('name');
          });
      });
    });
  });

  function expectOwnerRelationship(relations: UserProfileRelation[]) {
    expect(relations.length).toEqual(1);
    expect(relations[0].type).toEqual(BaseUserProfileRelationType.Membership);
    expect(relations[0].role).toEqual(BaseMembershipRole.Owner);
  }
});