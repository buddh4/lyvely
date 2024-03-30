import { ProfileRelationRole } from '../../relations';
import { ProfileVisibilityLevel } from '../../core';
import { verifyProfileVisibilityLevel } from './profile-permission.helper';

describe('Profile Permission Helper', () => {
  describe('verifyProfileVisibilityLevel', () => {
    function testVisibilityLevel(tests: [ProfileRelationRole, ProfileVisibilityLevel, boolean][]) {
      tests.forEach((test) => {
        it(`Role ${test[0]} against visibility ${
          test[1]
        } should result in ${test[2].toString()}`, () => {
          expect(verifyProfileVisibilityLevel(test[0], test[1])).toEqual(test[2]);
        });
      });
    }

    describe('Owner role', () => {
      testVisibilityLevel([
        [ProfileRelationRole.Owner, ProfileVisibilityLevel.Member, true],
        [ProfileRelationRole.Owner, ProfileVisibilityLevel.Organization, true],
        [ProfileRelationRole.Owner, ProfileVisibilityLevel.Follower, true],
        [ProfileRelationRole.Owner, ProfileVisibilityLevel.User, true],
        [ProfileRelationRole.Owner, ProfileVisibilityLevel.Visitor, true],
      ]);
    });
    describe('Admin role', () => {
      testVisibilityLevel([
        [ProfileRelationRole.Admin, ProfileVisibilityLevel.Member, true],
        [ProfileRelationRole.Admin, ProfileVisibilityLevel.Organization, true],
        [ProfileRelationRole.Admin, ProfileVisibilityLevel.Follower, true],
        [ProfileRelationRole.Admin, ProfileVisibilityLevel.User, true],
        [ProfileRelationRole.Admin, ProfileVisibilityLevel.Visitor, true],
      ]);
    });
    describe('Moderator role', () => {
      testVisibilityLevel([
        [ProfileRelationRole.Moderator, ProfileVisibilityLevel.Member, true],
        [ProfileRelationRole.Moderator, ProfileVisibilityLevel.Organization, true],
        [ProfileRelationRole.Moderator, ProfileVisibilityLevel.Follower, true],
        [ProfileRelationRole.Moderator, ProfileVisibilityLevel.User, true],
        [ProfileRelationRole.Moderator, ProfileVisibilityLevel.Visitor, true],
      ]);
    });
    describe('Member role', () => {
      testVisibilityLevel([
        [ProfileRelationRole.Member, ProfileVisibilityLevel.Member, true],
        [ProfileRelationRole.Member, ProfileVisibilityLevel.Organization, true],
        [ProfileRelationRole.Member, ProfileVisibilityLevel.Follower, true],
        [ProfileRelationRole.Member, ProfileVisibilityLevel.User, true],
        [ProfileRelationRole.Member, ProfileVisibilityLevel.Visitor, true],
      ]);
    });
    describe('Guest role', () => {
      testVisibilityLevel([
        [ProfileRelationRole.Guest, ProfileVisibilityLevel.Member, true],
        [ProfileRelationRole.Guest, ProfileVisibilityLevel.Organization, true],
        [ProfileRelationRole.Guest, ProfileVisibilityLevel.Follower, true],
        [ProfileRelationRole.Guest, ProfileVisibilityLevel.User, true],
        [ProfileRelationRole.Guest, ProfileVisibilityLevel.Visitor, true],
      ]);
    });
    describe('Organization role', () => {
      testVisibilityLevel([
        [ProfileRelationRole.Organization, ProfileVisibilityLevel.Member, false],
        [ProfileRelationRole.Organization, ProfileVisibilityLevel.Organization, true],
        [ProfileRelationRole.Organization, ProfileVisibilityLevel.Follower, true],
        [ProfileRelationRole.Organization, ProfileVisibilityLevel.User, true],
        [ProfileRelationRole.Organization, ProfileVisibilityLevel.Visitor, true],
      ]);
    });
    describe('Follower role', () => {
      testVisibilityLevel([
        [ProfileRelationRole.Follower, ProfileVisibilityLevel.Member, false],
        [ProfileRelationRole.Follower, ProfileVisibilityLevel.Organization, false],
        [ProfileRelationRole.Follower, ProfileVisibilityLevel.Follower, true],
        [ProfileRelationRole.Follower, ProfileVisibilityLevel.User, true],
        [ProfileRelationRole.Follower, ProfileVisibilityLevel.Visitor, true],
      ]);
    });
    describe('User role', () => {
      testVisibilityLevel([
        [ProfileRelationRole.User, ProfileVisibilityLevel.Member, false],
        [ProfileRelationRole.User, ProfileVisibilityLevel.Organization, false],
        [ProfileRelationRole.User, ProfileVisibilityLevel.Follower, false],
        [ProfileRelationRole.User, ProfileVisibilityLevel.User, true],
        [ProfileRelationRole.User, ProfileVisibilityLevel.Visitor, true],
      ]);
    });
    describe('Visitor role', () => {
      testVisibilityLevel([
        [ProfileRelationRole.Visitor, ProfileVisibilityLevel.Member, false],
        [ProfileRelationRole.Visitor, ProfileVisibilityLevel.Organization, false],
        [ProfileRelationRole.Visitor, ProfileVisibilityLevel.Follower, false],
        [ProfileRelationRole.Visitor, ProfileVisibilityLevel.User, false],
        [ProfileRelationRole.Visitor, ProfileVisibilityLevel.Visitor, true],
      ]);
    });
    describe('Undefined role', () => {
      testVisibilityLevel([[<any>undefined, ProfileVisibilityLevel.Member, false]]);
    });
  });
});
