import { Injectable } from '@nestjs/common';
import { Membership, Profile, ProfileRelationUserInfo } from '../schemas';
import { MembershipsDao } from '../daos';
import { EntityIdentity, Transaction } from '@/core';
import { User, UsersService } from '@/users';
import { ProfileMembershipRole, ProfileType, ForbiddenServiceException } from '@lyvely/interface';

@Injectable()
export class ProfileMembershipService {
  constructor(private readonly membershipDao: MembershipsDao, private usersService: UsersService) {}

  async getMemberShips(profile: EntityIdentity<Profile>) {
    return this.membershipDao.findAllByProfile(profile);
  }

  async updateMembershipInfo(
    membership: Membership,
    { displayName, description }: Pick<ProfileRelationUserInfo, 'displayName' | 'description'>,
  ) {
    return await this.membershipDao.updateOneSetById(membership, {
      'userInfo.displayName': displayName,
      'userInfo.description': description,
    });
  }

  /**
   * Creates a membership association between a profile and a user.
   * If the profile is a user profile, it does only accept one membership
   * If a membership already exists, it updates the role if it's different.
   * Otherwise, it creates a new membership and increments the profile count for the user.
   * @param profile The profile for which the membership is being created.
   * @param member The user who is becoming a member.
   * @param role The role of the user in the membership. Defaults to 'Member'.
   * @param transaction An optional transaction context for database operations.
   * @returns A Promise resolving to the created or updated membership.
   */
  async createMembership(
    profile: Profile,
    member: User,
    role: ProfileMembershipRole = ProfileMembershipRole.Member,
    transaction?: Transaction,
  ): Promise<Membership> {
    const existingMembership = await this.membershipDao.findByProfileAndUser(
      profile,
      member,
      transaction,
    );

    if (
      profile.isOfType(ProfileType.User) &&
      (existingMembership || role !== ProfileMembershipRole.Owner)
    ) {
      throw new ForbiddenServiceException(
        'Can not create additional or non owner membership for user profile',
      );
    }

    if (existingMembership) {
      if (existingMembership.role !== role) {
        await this.membershipDao.updateOneSetById(existingMembership, { role }, transaction);
      }
      return existingMembership;
    }

    const [membership] = await Promise.all([
      this.membershipDao.addMembership(profile, member, role, transaction),
      this.usersService.incrementProfileCount(member, profile.type, transaction),
    ]);

    return membership;
  }
}
