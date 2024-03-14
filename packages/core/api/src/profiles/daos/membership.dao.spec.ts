import { MembershipsDao } from './index';
import { ProfileRelationUserInfo } from '../schemas';
import { BaseUserProfileRelationType, ProfileMembershipRole } from '@lyvely/interface';
import { buildTest, LyvelyTestingModule } from '@/testing';
import { profilesTestPlugin, ProfileTestDataUtils } from '../testing';

describe('MembershipDao', () => {
  let testingModule: LyvelyTestingModule;
  let membershipDao: MembershipsDao;
  let testData: ProfileTestDataUtils;

  const TEST_KEY = 'membership_dao';

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY).plugins([profilesTestPlugin]).compile();
    membershipDao = testingModule.get<MembershipsDao>(MembershipsDao);
    testData = testingModule.get(ProfileTestDataUtils);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  it('should be defined', () => {
    expect(membershipDao).toBeDefined();
  });

  describe('addMembership()', () => {
    it('add membership with default role', async () => {
      const { member, profile } = await testData.createSimpleGroup();

      const membership = await membershipDao.addMembership(profile, member);
      expect(membership).toBeDefined();
      expect(membership.userInfo).toBeDefined();
      expect(membership.userInfo.displayName).toEqual(member.username);
      expect(membership.userInfo.email).toEqual(member.email);
      expect(membership.userInfo instanceof ProfileRelationUserInfo).toEqual(true);
      expect(membership.uid).toEqual(member._id);
      expect(membership.oid).toEqual(profile.oid);
      expect(membership.pid).toEqual(profile._id);
      expect(membership.type).toEqual(BaseUserProfileRelationType.Membership);
      expect(membership.role).toEqual(ProfileMembershipRole.Member);
    });
  });

  describe('findAllByUser()', () => {
    it('find owner relation', async () => {
      const { user, profile } = await testData.createUserAndProfile('user1');
      const memberships = await membershipDao.findAllByUser(user);

      expect(memberships.length).toEqual(1);

      const [membership] = memberships;
      expect(membership.uid.toString()).toEqual(user.id);
      expect(membership.pid.toString()).toEqual(profile.id);
      expect(membership.type).toEqual(BaseUserProfileRelationType.Membership);
    });

    it('find member relation', async () => {
      const owner = await testData.createUser('user1');
      const member = await testData.createUser('user2');
      const profile = await testData.createProfile(owner, 'myTeam');
      const savedModel = await membershipDao.addMembership(profile, member);

      const memberships = await membershipDao.findAllByUser(member);
      expect(memberships.length).toEqual(1);

      const [membership] = memberships;

      expect(membership.pid.toString()).toEqual(profile.id);
      expect(membership._id).toEqual(savedModel._id);
    });

    it('do not include non-membership relation', async () => {
      const owner = await testData.createUser('user1');
      const follower = await testData.createUser('user2');
      const profile = await testData.createProfile(owner, 'myTeam');
      const savedModel = await testData.addProfileRelation(
        profile,
        follower,
        'Followership',
        'Follower',
      );

      // Just make sure the model actually was saved
      expect(savedModel).toBeDefined();
      expect(savedModel._id).toBeDefined();
      expect(savedModel.type).toEqual('Followership');

      const memberships = await membershipDao.findAllByUser(follower);
      expect(memberships.length).toEqual(0);
    });
  });

  describe('findByUserAndProfile()', () => {
    it('find owner relation', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const membership = await membershipDao.findByUserAndProfile(user, profile);
      expect(membership).toBeDefined();
      expect(membership[0].uid).toEqual(user._id);
      expect(membership[0].pid).toEqual(profile._id);
    });

    it('do not find non related membership', async () => {
      const { user: user1 } = await testData.createUserAndProfile('user1');
      const { profile: profile2 } = await testData.createUserAndProfile('user2');
      const membership = await membershipDao.findByUserAndProfile(user1, profile2);
      expect(membership.length).toEqual(0);
    });
  });
});
