import { Injectable } from '@nestjs/common';
import { Membership, Profile, ProfileRelationUserInfo } from '../schemas';
import { MembershipsDao } from '../daos';
import { DocumentIdentity, Transaction } from '@/core';
import { User, UsersService } from '@/users';
import {
  BaseUserProfileRelationType,
  ForbiddenServiceException,
  IntegrityException,
  ProfileMembershipRole,
  ProfileType,
} from '@lyvely/interface';
import type { ProfileMembershipContext } from '../contexts';

@Injectable()
export class ProfileMembershipService {
  constructor(
    private readonly membershipDao: MembershipsDao,
    private usersService: UsersService
  ) {}

  /**
   * Retrieves the memberships associated with a given profile.
   *
   * @param {DocumentIdentity<Profile>} profile - The profile document identity.
   * @return {Promise<Array<Membership>>} - A promise that resolves to an array of Membership objects.
   */
  async getMemberShips(profile: DocumentIdentity<Profile>) {
    return this.membershipDao.findAllByProfile(profile);
  }

  /**
   * Revoke the membership of a profile and removes the membership relation from the given context.
   *
   * @param {ProfileMembershipContext} context - The context containing the profile membership to be revoked.
   *
   * @return {Promise<void>} - A promise that resolves when the membership is revoked.
   */
  async revoke(context: ProfileMembershipContext) {
    await this.canRevokeMembershipOrThrow(context);
    // TODO: Live update for other users
    await this.membershipDao.deleteById(context.getMembership());
    context.removeRelationsByType(BaseUserProfileRelationType.Membership);
  }

  /**
   * Determines whether the membership can be revoked or throws an exception.
   *
   * @param {ProfileMembershipContext} context - The context object containing the membership details.
   * @throws {IntegrityException} - Throws an exception if the membership is the only owner membership.
   * @private
   */
  private async canRevokeMembershipOrThrow(context: ProfileMembershipContext) {
    if (!context.isProfileOwner()) return;

    const owners = await this.membershipDao.findByRole(
      context.profile,
      ProfileMembershipRole.Owner
    );

    if (owners.length === 1) {
      throw new IntegrityException('Can not delete only owner membership.');
    }
  }

  /**
   * Updates the profile membership information of a user.
   *
   * @param {Membership} membership - The membership object to update.
   * @param {Object} info - The updated display name and description.
   * @param {string} info.displayName - The updated display name.
   * @param {string} info.description - The updated description.
   *
   * @return {Promise} - Resolves to the updated membership info object.
   */
  async updateMembershipInfo(
    membership: Membership,
    { displayName, description }: Pick<ProfileRelationUserInfo, 'displayName' | 'description'>
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
    transaction?: Transaction
  ): Promise<Membership> {
    const existingMembership = await this.membershipDao.findByProfileAndUser(
      profile,
      member,
      transaction
    );

    if (
      profile.isOfType(ProfileType.User) &&
      (existingMembership || role !== ProfileMembershipRole.Owner)
    ) {
      throw new ForbiddenServiceException(
        'Can not create additional or non owner membership for user profile'
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
