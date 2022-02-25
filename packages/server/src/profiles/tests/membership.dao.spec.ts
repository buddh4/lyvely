import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { TestDataUtils } from '../../test/utils/test-data.utils';
import { MembershipsDao } from '../daos';
import {
  BaseMembershipRole,
  BaseUserProfileRelationType
} from '../schemas';
import { ProfileType } from 'lyvely-common';
import { createActivityTestingModule } from '../../activities/tests/utils/activities.test.utils';

describe('MembershipDao', () => {
  let testingModule: TestingModule;
  let membershipDao: MembershipsDao;
  let testData: TestDataUtils;

  const TEST_KEY = 'membership_dao';

  beforeEach(async () => {
    testingModule = await createActivityTestingModule(TEST_KEY,[MembershipsDao]).compile();
    membershipDao = testingModule.get<MembershipsDao>(MembershipsDao);
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
  });

  afterEach(async () => {
    await testData.reset(TEST_KEY);
  });

  it('should be defined', () => {
    expect(membershipDao).toBeDefined();
  });

  describe('addMembership()', () => {
    it('add membership with default role', async () => {
      const { member, profile } = await testData.createSimpleGroup();

      const membership = await membershipDao.addMembership(profile, member);
      expect(membership).toBeDefined();
      expect(membership.uid).toEqual(member._id);
      expect(membership.pid).toEqual(profile._id);
      expect(membership.type).toEqual(BaseUserProfileRelationType.Membership);
      expect(membership.role).toEqual(BaseMembershipRole.Member);
    });

    it('add membership with custom role', async () => {
      const owner = await testData.createUser('owner');
      const member = await testData.createUser('member');
      const profile = await testData.createProfile(owner, 'group', ProfileType.Group);

      const membership = await membershipDao.addMembership(profile, member, 'superUser');
      expect(membership).toBeDefined();
      expect(membership.role).toEqual('superUser');
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
        'Follower'
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
      const membership = await membershipDao.findByUserAndProfile(
        user,
        profile,
      );
      expect(membership).toBeDefined();
      expect(membership.uid).toEqual(user._id);
      expect(membership.pid).toEqual(profile._id);
    });

    it('do not find non related membership', async () => {
      const {user: user1,} = await testData.createUserAndProfile('user1');
      const {profile: profile2,} = await testData.createUserAndProfile('user2');
      const membership = await membershipDao.findByUserAndProfile(user1, profile2);
      expect(membership).toBeNull();
    });
  });
});
