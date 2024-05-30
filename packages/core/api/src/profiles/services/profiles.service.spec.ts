import { ProfilesService } from './index';
import {
  BaseUserProfileRelationType,
  ForbiddenServiceException,
  GlobalPermissionRole,
  ProfileMembershipRole,
  ProfileType,
  ProfileVisibilityLevel,
  UniqueConstraintException,
} from '@lyvely/interface';
import { ILyvelyTestingModule } from '@/testing';
import { GroupProfile, Organization, UserProfile, UserProfileRelation } from '../schemas';
import { ProfileTestDataUtils } from '../testing';
import { ProtectedProfileContext } from '../models';
import { buildProfileTest } from '@/profiles';

describe('ProfileService', () => {
  let testingModule: ILyvelyTestingModule;
  let profileService: ProfilesService;
  let testData: ProfileTestDataUtils;

  const TEST_KEY = 'profile_service_group';

  beforeEach(async () => {
    testingModule = await buildProfileTest(TEST_KEY).compile();
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
    describe('findProfileContextByHandle()', () => {
      it('find sub profile context for owner', async () => {
        const { owner, organization } = await testData.createSimpleOrganization();
        const subProfile = await testData.createSubProfile(
          owner,
          organization,
          ProfileType.Group,
          ProfileVisibilityLevel.Member,
          { handle: 'SubProfile' }
        );
        const context = await profileService.findProfileContextByHandle(owner, 'SubProfile');

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
        const subProfile = await testData.createSubProfile(
          owner,
          organization,
          ProfileType.Group,
          ProfileVisibilityLevel.Member,
          { handle: 'SubProfile' }
        );
        const context = await profileService.findProfileContextByHandle(member, 'SubProfile');

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
        const { owner, organization } = await testData.createSimpleOrganization({
          handle: 'TestOrg',
        });
        const context = await profileService.findProfileContextByHandle(owner, 'TestOrg');

        expect(context instanceof ProtectedProfileContext).toEqual(true);
        expect(context.profile._id).toEqual(organization._id);
        expect(context.user._id).toEqual(owner._id);
        expect(context.getOrganizationContext() instanceof ProtectedProfileContext).toEqual(true);
        expect(context.organization instanceof Organization).toEqual(true);
        expect(context.organization?._id).toEqual(organization._id);
      });
    });
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
          organization._id
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

    describe('createOrganization()', () => {
      it('create organization', async () => {
        const user = await testData.createUser('User1', { role: GlobalPermissionRole.Admin });
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
        expect(profile.meta.deletable).toEqual(true);
        expect(profile.meta.deletable).toEqual(true);
        expectOwnerRelationship(relations);
      });

      it('moderator can not create organization', async () => {
        const user = await testData.createUser('User1', { role: GlobalPermissionRole.Moderator });

        const { profile } = await profileService.createOrganization(user, {
          name: 'SomeOrganization',
        });
        expect(profile).toBeDefined();
      });

      it('normal user can not create organization', async () => {
        expect.assertions(1);
        const user = await testData.createUser('User1', { role: GlobalPermissionRole.User });

        try {
          await profileService.createOrganization(user, { name: 'ShouldFail' });
        } catch (e) {
          expect(e instanceof ForbiddenServiceException).toEqual(true);
        }
      });

      it('normal user can not create organization', async () => {
        expect.assertions(1);
        const user = await testData.createUser('User1', { role: GlobalPermissionRole.User });

        try {
          await profileService.createOrganization(user, { name: 'ShouldFail' });
        } catch (e) {
          expect(e instanceof ForbiddenServiceException).toEqual(true);
        }
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

      it('organization name is globally unique', async () => {
        const user = await testData.createUser('User1', { role: GlobalPermissionRole.Moderator });
        await profileService.createOrganization(user, { name: 'SomeOrganization' });

        const user2 = await testData.createUser('User2', { role: GlobalPermissionRole.Moderator });
        expect.assertions(2);
        return profileService.createOrganization(user2, { name: 'SomeOrganization' }).catch((e) => {
          expect(e instanceof UniqueConstraintException).toEqual(true);
          expect(e.data.fields[0].property).toEqual('name');
        });
      });

      it('organization name is unique per owner', async () => {
        const user = await testData.createUser('User1', { role: GlobalPermissionRole.Moderator });
        await profileService.createUserProfile(user, { name: 'SomeOrganization' });

        expect.assertions(2);
        return profileService.createOrganization(user, { name: 'SomeOrganization' }).catch((e) => {
          expect(e instanceof UniqueConstraintException).toEqual(true);
          expect(e.data.fields[0].property).toEqual('name');
        });
      });
    });
  });

  describe('createGroupProfile', () => {
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
      expect(profile.meta.deletable).toEqual(true);
      expectOwnerRelationship(relations);
    });

    it('group profile name is unique per user', async () => {
      const user = await testData.createUser('User1');
      await profileService.createGroupProfile(user, { name: 'Some Profile' });

      expect.assertions(2);
      try {
        await profileService.createGroupProfile(user, { name: 'Some Profile' });
      } catch (e) {
        expect(e instanceof UniqueConstraintException).toEqual(true);
        expect((<any>e).data.fields[0].property).toEqual('name');
      }
    });

    it('group profile with guid handle', async () => {
      const user = await testData.createUser('User1');
      const context = await profileService.createGroupProfile(user, {
        name: 'Some Profile',
        handle: user.guid,
      });
      expect(context.profile.handle).toEqual(user.guid);
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
        expect(profile.handle).toEqual('OwnerProfile');
        expect(profile.locale).toEqual(organization.locale);
        expect(profile.ownerId).toEqual(owner._id);
        expect(profile.type).toEqual(ProfileType.User);
        expect(profile.hasOrg).toEqual(true);
        expect(profile.oid).not.toEqual(profile._id);
        expect(profile.oid).toEqual(organization._id);
        expect(profile.meta).toBeDefined();
        expect(profile.meta.deletable).toEqual(true);
        expectOwnerRelationship(relations);
      });

      it('fallback handle is available', async () => {
        await testData.createSimpleGroup(ProfileVisibilityLevel.Member, {
          name: 'test',
          handle: 'test',
        });
        const { profile } = await profileService.createUserProfile(
          ProfileTestDataUtils.createDummyUser(),
          {
            name: 'test',
          }
        );

        expect(profile.handle).not.toEqual('test');
        expect(profile.handle.startsWith('test')).toEqual(true);
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

      it('adopt owner calendar preferences', async () => {
        const user = await testData.createUser('User1');
        user.settings = { calendar: { weekStart: 2, yearStart: 3 } };
        const { profile } = await profileService.createUserProfile(user, {
          name: 'SomeProfile',
        });
        expect(profile.settings.calendar).toBeDefined();
        expect(profile.settings.calendar.weekStart).toEqual(2);
        expect(profile.settings.calendar.yearStart).toEqual(3);
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

  describe('findProfileWithOrganization()', () => {
    it('find non sub profile by pid', async () => {
      const { profile: userProfile } = await testData.createUserAndProfile();
      const { profile, organization } = await profileService.findProfileWithOrganization(
        userProfile._id
      );
      expect(profile._id).toEqual(userProfile._id);
      expect(organization).toBeNull();
    });

    it('find sub profile by pid', async () => {
      const { owner, organization: myOrg } = await testData.createSimpleOrganization();
      const subProfile = await testData.createSubProfile(owner, myOrg);
      const { profile, organization } = await profileService.findProfileWithOrganization(
        subProfile._id
      );
      expect(profile._id).toEqual(subProfile._id);
      expect(organization).toBeDefined();
      expect(organization?._id).toEqual(myOrg._id);
    });

    it('find sub profile by instance', async () => {
      const { owner, organization: myOrg } = await testData.createSimpleOrganization();
      const subProfile = await testData.createSubProfile(owner, myOrg);
      const { profile, organization } =
        await profileService.findProfileWithOrganization(subProfile);
      expect(profile._id).toEqual(subProfile._id);
      expect(organization).toBeDefined();
      expect(organization?._id).toEqual(myOrg._id);
    });

    it('use of invalid oid is ignored', async () => {
      const { owner, organization: myOrg } = await testData.createSimpleOrganization();
      const someProfile = await testData.createProfile(owner);
      const subProfile = await testData.createSubProfile(owner, myOrg);
      const { profile, organization } = await profileService.findProfileWithOrganization(
        subProfile,
        someProfile
      );
      expect(profile._id).toEqual(subProfile._id);
      expect(organization).toBeDefined();
      expect(organization?._id).toEqual(myOrg._id);
    });

    it('use of invalid oid is ignored when using ids', async () => {
      const { owner, organization: myOrg } = await testData.createSimpleOrganization();
      const someProfile = await testData.createProfile(owner);
      const subProfile = await testData.createSubProfile(owner, myOrg);
      const { profile, organization } = await profileService.findProfileWithOrganization(
        subProfile._id,
        someProfile.id
      );
      expect(profile._id).toEqual(subProfile._id);
      expect(organization).toBeDefined();
      expect(organization?._id).toEqual(myOrg._id);
    });

    it('use of invalid oid instance is ignored', async () => {
      const { owner, organization: myOrg } = await testData.createSimpleOrganization();
      const someProfile = await testData.createProfile(owner);
      const subProfile = await testData.createSubProfile(owner, myOrg);
      const { profile, organization } = await profileService.findProfileWithOrganization(
        subProfile._id,
        someProfile
      );
      expect(profile._id).toEqual(subProfile._id);
      expect(organization).toBeDefined();
      expect(organization?._id).toEqual(myOrg._id);
    });
  });

  describe('findProfileContext()', () => {
    it('find owner membership', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const relations = await profileService.findProfileContext(user, profile);
      const membership = relations.getMembership();
      expect(membership).toBeDefined();
      expect(membership?.role).toEqual(ProfileMembershipRole.Owner);
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

  function expectOwnerRelationship(relations: UserProfileRelation[]) {
    expect(relations.length).toEqual(1);
    expect(relations[0].type).toEqual(BaseUserProfileRelationType.Membership);
    expect(relations[0].role).toEqual(ProfileMembershipRole.Owner);
  }
});
