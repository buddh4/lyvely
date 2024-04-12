import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, assureObjectId, DocumentIdentity, IBaseQueryOptions, SaveOptions } from '@/core';
import { Membership, Profile } from '../schemas';
import { User } from '@/users';
import { AbstractUserProfileRelationsDao } from './abstract-user-profile-relations.dao';
import { ProfileMembershipRole } from '@lyvely/interface';
import { Type } from '@lyvely/common';

@Injectable()
export class MembershipsDao extends AbstractUserProfileRelationsDao<Membership> {
  constructor(@InjectModel(Membership.name) protected model: Model<Membership>) {
    super();
  }

  /**
   * Retrieves a list of memberships that match the given profile and role.
   *
   * @param {DocumentIdentity<Profile>} profile - The profile to search memberships for.
   * @param {ProfileMembershipRole} role - The role of the memberships to search for.
   *
   * @return {Promise<Membership[]>} A promise that resolves to an array of memberships.
   */
  async findByRole(
    profile: DocumentIdentity<Profile>,
    role: ProfileMembershipRole,
  ): Promise<Membership[]> {
    return this.findAll({
      _id: assureObjectId(profile),
      role,
    });
  }

  /**
   * Adds a membership to a profile for a user with the specified role.
   *
   * @param {Profile} profile - The profile to add the membership to.
   * @param {User} user - The user to add as a member.
   * @param {ProfileMembershipRole} role - (optional) The role for the membership.
   * @param {SaveOptions} options - (optional) Additional options for saving the membership.
   *
   * @return {Promise<Membership>} - A promise that resolves to the created membership.
   */
  async addMembership(
    profile: Profile,
    user: User,
    role: ProfileMembershipRole = ProfileMembershipRole.Member,
    options?: SaveOptions,
  ): Promise<Membership> {
    return this.save(Membership.create({ profile, user, role }), options);
  }

  /**
   * Finds a membership by profile and user.
   *
   * @param {DocumentIdentity<Profile>} profile - The profile ID or object.
   * @param {DocumentIdentity<User>} user - The user ID or object.
   * @param {IBaseQueryOptions} [options] - The query options.
   * @returns {Promise<Membership|null>} - A promise that resolves to the found membership or `null` if not found.
   */
  async findByProfileAndUser(
    profile: DocumentIdentity<Profile>,
    user: DocumentIdentity<User>,
    options?: IBaseQueryOptions,
  ): Promise<Membership | null> {
    return this.findOne(
      {
        uid: assureObjectId(user),
        pid: assureObjectId(profile),
      },
      options,
    );
  }

  getModelConstructor(): Type<Membership> {
    return Membership;
  }

  getModuleId(): string {
    return 'profiles';
  }
}
