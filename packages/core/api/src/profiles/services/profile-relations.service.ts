import { Injectable } from '@nestjs/common';
import { assureObjectId, EntityIdentity } from '@/core';
import { OptionalUser, User, UsersService } from '@/users';
import { EntityNotFoundException } from '@lyvely/common';
import { Profile, UserProfileRelation } from '../schemas';
import { UserAndProfileRelations } from '../models';
import { ProfileDao, UserProfileRelationsDao } from '../daos';
import { getProfileRelationRole } from '@lyvely/core-interface';
import { IUserWithProfileRelation } from '../interfaces';

@Injectable()
export class ProfileRelationsService {
  constructor(
    private profileDao: ProfileDao,
    private profileRelationsDao: UserProfileRelationsDao,
    private usersService: UsersService,
  ) {}

  /**
   * Returns all existing relations between a profile and users, while emphasizing the relation between the profile and
   * the given user.
   * @param user The user whose relations with the profile are to be emphasized.
   * @param identity The identity of the profile.
   * @throws EntityNotFoundException if profile does not exist
   * @returns A Promise resolving to an object containing all relations of the profile.
   */
  async findProfileRelations(
    identity: EntityIdentity<Profile>,
    user: OptionalUser,
  ): Promise<UserAndProfileRelations> {
    const profile = await this.findProfileByIdentity(identity);

    const profileRelations = await this.profileRelationsDao.findAllByProfile(identity);
    const userRelations = user
      ? profileRelations.filter((relation) => relation.uid.equals(user._id))
      : [];

    const userOrganizationRelations =
      user && profile.hasOrg
        ? await this.profileRelationsDao.findByUserAndProfile(user, profile.oid)
        : [];

    const role = getProfileRelationRole(user, profileRelations, userOrganizationRelations);

    return new UserAndProfileRelations({
      user,
      role,
      profile,
      profileRelations,
      userRelations,
      userOrganizationRelations,
    });
  }

  /**
   * Returns all profile relations of a given user.
   * @param user
   */
  async findAllProfileRelationsByUser(user: User): Promise<UserProfileRelation[]> {
    return this.profileRelationsDao.findAllByUser(user);
  }

  /**
   * Finds all relations between given profile and user identities.
   * @param profile
   * @param uids
   */
  async findAllProfileRelationsByUsers(
    profile: EntityIdentity<Profile>,
    uids: EntityIdentity<User>[],
  ): Promise<UserProfileRelation[]> {
    return this.profileRelationsDao.findAll({
      pid: assureObjectId(profile),
      uid: { $in: uids },
    });
  }

  /**
   * Finds all user relations for a profile and associated organization based on the user entity.
   * @param {EntityIdentity<User> | null | undefined} user - The user entity to search relations for. If null or undefined, function returns visitor relations.
   * @param {Profile} profile - The profile entity to search relations for. If the profile does not have an associated organization, only profile relations are returned.
   * @returns {Promise<{ profileRelations: T[]; organizationRelations?: T[] }>} - A promise that resolves to an object containing arrays of user relations for both the profile and the organization.
   */
  async findAllProfileAndOrganizationRelationsByUser(
    profile: Profile,
    user: EntityIdentity<User> | null | undefined,
  ): Promise<{
    profileRelations: UserProfileRelation[];
    organizationRelations?: UserProfileRelation[];
  }> {
    return this.profileRelationsDao.findAllProfileAndOrganizationRelationsByUser(profile, user);
  }

  /**
   * Finds all user relations of a profile entity.
   *
   * @throws EntityNotFoundException if profile does not exist
   * @param identity
   */
  async findAllUserProfileRelations(
    identity: EntityIdentity<Profile>,
  ): Promise<IUserWithProfileRelation[]> {
    const profile = await this.findProfileByIdentity(identity);

    const profileRelations = await this.profileRelationsDao.findAllByProfile(profile);

    const result: { user: User; profile: Profile; relations: UserProfileRelation[] }[] = [];
    const uids = profileRelations.map((relation) => relation.uid);
    const users = await this.usersService.findUsersById(uids);
    users.forEach((user) => {
      const relations = profileRelations.filter((relation) => relation.uid.equals(user._id));
      result.push({ user, profile, relations });
    });

    return result;
  }

  private async findProfileByIdentity(identity: EntityIdentity<Profile>) {
    const profile =
      identity instanceof Profile ? identity : await this.profileDao.findById(identity);
    if (!profile) throw new EntityNotFoundException();
    return profile;
  }
}
