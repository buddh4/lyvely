import { ProfileMembershipService } from './index';
import { ILyvelyTestingModule } from '@/testing';
import { buildProfileTest, ProfileTestDataUtils } from '../testing';
import {
  BaseUserProfileRelationType,
  ProfileMembershipRole,
  ProfileType,
  UserStatus,
  ForbiddenServiceException,
} from '@lyvely/interface';

describe('ProfileMembershipService', () => {
  let testingModule: ILyvelyTestingModule;
  let membershipService: ProfileMembershipService;

  beforeEach(async () => {
    testingModule = await buildProfileTest('ProfileMembershipService').compile();
    membershipService = testingModule.get(ProfileMembershipService);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  describe('createMembership', () => {
    it('create group membership', async () => {
      const { profile } = ProfileTestDataUtils.createDummyUserAndProfile(
        {},
        { type: ProfileType.Group }
      );

      const user = ProfileTestDataUtils.createDummyUser();

      const membership = await membershipService.createMembership(profile, user);
      expect(membership).toBeDefined();
      expect(membership.role).toEqual(ProfileMembershipRole.Member);
      expect(membership.type).toEqual(BaseUserProfileRelationType.Membership);
      expect(membership.uid).toEqual(user._id);
      expect(membership.pid).toEqual(profile._id);
      expect(membership.oid).toEqual(profile.oid);
      expect(membership.userInfo.displayName).toEqual(user.getDisplayName());
      expect(membership.userInfo.email).toEqual(user.email);
      expect(membership.userInfo.guid).toEqual(user.guid);
      expect(membership.relationStatus).toEqual(UserStatus.Active);
    });
  });

  it('can not create two memberships on user profile', async () => {
    const { profile } = ProfileTestDataUtils.createDummyUserAndProfile(
      {},
      { type: ProfileType.User }
    );

    const owner = ProfileTestDataUtils.createDummyUser();
    await membershipService.createMembership(profile, owner, ProfileMembershipRole.Owner);

    try {
      await membershipService.createMembership(
        profile,
        ProfileTestDataUtils.createDummyUser({ username: 'user2' })
      );
    } catch (e) {
      expect(e instanceof ForbiddenServiceException).toEqual(true);
    }
  });

  it('can only create ownership on user profile', async () => {
    const { profile } = ProfileTestDataUtils.createDummyUserAndProfile(
      {},
      { type: ProfileType.User }
    );

    try {
      const user = ProfileTestDataUtils.createDummyUser();
      await membershipService.createMembership(profile, user, ProfileMembershipRole.Member);
    } catch (e) {
      expect(e instanceof ForbiddenServiceException).toEqual(true);
    }
  });

  it('update role if membership already exists', async () => {
    const { profile } = ProfileTestDataUtils.createDummyUserAndProfile(
      {},
      { type: ProfileType.Group }
    );

    const user = ProfileTestDataUtils.createDummyUser();
    await membershipService.createMembership(profile, user, ProfileMembershipRole.Member);
    await membershipService.createMembership(profile, user, ProfileMembershipRole.Moderator);

    const memberships = await membershipService.getMemberShips(profile);
    expect(memberships.length).toEqual(1);
    expect(memberships[0].uid).toEqual(user._id);
    expect(memberships[0].role).toEqual(ProfileMembershipRole.Moderator);
  });
});
