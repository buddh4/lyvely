import { ProfilesService } from './index';
import { UniqueConstraintException } from '@lyvely/common';
import {
  ProfileType,
  ProfileMembershipRole,
  BaseUserProfileRelationType,
} from '@lyvely/core-interface';
import { buildTest, LyvelyTestingModule } from '@/testing';
import { GroupProfile, Organization, UserProfile, UserProfileRelation } from '../schemas';
import { profilesTestPlugin, ProfileTestDataUtils } from '../testing';
import { ProtectedProfileContext } from '../models';

describe('ProfileService', () => {
  let testingModule: LyvelyTestingModule;
  let profileService: ProfilesService;
  let testData: ProfileTestDataUtils;

  const TEST_KEY = 'profile_service_group';

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

  describe('Organization Profile', () => {
    describe('findProfileContext()', () => {
      it('find sub profile context for owner', async () => {
        const { owner, organization } = await testData.createSimpleOrganization();
        const subProfile = await testData.createSubProfile(owner, organization);
        const context = await profileService.findProfileContext(owner, subProfile);

        expect(context instanceof ProtectedProfileContext).toEqual(true);
        expect(context.profile._id).toEqual(subProfile._id);
        expect(context.user._id).toEqual(owner._id);
        expect(context.getOrganizationContext() instanceof ProtectedProfileContext).toEqual(true);
        expect(context.organization instanceof Organization).toEqual(true);
        expect(context.organization!._id).toEqual(organization._id);
        expect(context.getOrganizationContext()?.isProfileOwner()).toEqual(true);
      });

      it('find sub profile context for member', async () => {
        const { owner, organization, member } = await testData.createSimpleOrganization();
        const subProfile = await testData.createSubProfile(owner, organization);
        const context = await profileService.findProfileContext(
          member,
          subProfile._id,
          organization._id,
        );

        expect(context instanceof ProtectedProfileContext).toEqual(true);
        expect(context.profile._id).toEqual(subProfile._id);
        expect(context.user._id).toEqual(member._id);
        expect(context.getOrganizationContext() instanceof ProtectedProfileContext).toEqual(true);
        expect(context.organization instanceof Organization).toEqual(true);
        expect(context.organization!._id).toEqual(organization._id);
        expect(context.getOrganizationContext()?.isProfileOwner()).toEqual(false);
        expect(context.getOrganizationContext()?.isProfileMember()).toEqual(true);
      });

      it('find organization profile context', async () => {
        const { owner, organization } = await testData.createSimpleOrganization();
        const context = await profileService.findProfileContext(owner, organization);

        expect(context instanceof ProtectedProfileContext).toEqual(true);
        expect(context.profile._id).toEqual(organization._id);
        expect(context.user._id).toEqual(owner._id);
        expect(context.getOrganizationContext() instanceof ProtectedProfileContext).toEqual(true);
        expect(context.organization instanceof Organization).toEqual(true);
        expect(context.organization?._id).toEqual(organization._id);
      });
    });

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
      const { member, organization } = await testData.createSimpleOrganization({
        name: 'MyOrganization',
      });

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
        const { member, organization } = await testData.createSimpleOrganization({
          name: 'MyOrganization',
        });

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
    expect(relations[0].role).toEqual(ProfileMembershipRole.Owner);
  }
});
