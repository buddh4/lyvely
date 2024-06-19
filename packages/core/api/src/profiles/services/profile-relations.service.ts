import { Injectable } from '@nestjs/common';
import { assureObjectId, DocumentIdentity } from '@/core';
import { type OptionalUser, User, UsersService } from '@/users';
import { DocumentNotFoundException } from '@lyvely/interface';
import { Profile, UserProfileRelation, IUserWithProfileRelation } from '../schemas';
import { ProfilesDao, UserProfileRelationsDao } from '../daos';

@Injectable()
export class ProfileRelationsService {
  constructor(
    private profileDao: ProfilesDao,
    private profileRelationsDao: UserProfileRelationsDao,
    private usersService: UsersService
  ) {}

  /**
   * Returns all existing relations between a profile and users.
   * @param identity The identity of the profile.
   * @throws DocumentNotFoundException if profile does not exist
   * @returns A Promise resolving to an object containing profile relations.
   */
  async findProfileRelations(identity: DocumentIdentity<Profile>): Promise<UserProfileRelation[]> {
    return this.profileRelationsDao.findAllByProfile(identity);
  }

  /**
   * Returns all profile relations of a given user.
   * @param user
   */
  async findAllProfileRelationsByUser(user: OptionalUser): Promise<UserProfileRelation[]> {
    if (!user) return [];
    return this.profileRelationsDao.findAllByUser(user);
  }

  /**
   * Finds all relations between given profile and user identities.
   * @param profile
   * @param uids
   */
  async findAllProfileRelationsByUsers(
    profile: DocumentIdentity<Profile>,
    uids: DocumentIdentity<User>[]
  ): Promise<UserProfileRelation[]> {
    return this.profileRelationsDao.findAll({
      pid: assureObjectId(profile),
      uid: { $in: uids },
    });
  }

  /**
   * Finds all user relations for a profile and associated organization based on the user entity.
   * @param {DocumentIdentity<User> | null | undefined} user - The user entity to search relations for. If null or undefined, function returns visitor relations.
   * @param {Profile} profile - The profile entity to search relations for. If the profile does not have an associated organization, only profile relations are returned.
   * @returns {Promise<{ profileRelations: T[]; organizationRelations?: T[] }>} - A promise that resolves to an object containing arrays of user relations for both the profile and the organization.
   */
  async findAllProfileAndOrganizationRelationsByUser(
    profile: Profile,
    user: DocumentIdentity<User> | null | undefined
  ): Promise<{
    profileRelations: UserProfileRelation[];
    organizationRelations?: UserProfileRelation[];
  }> {
    return this.profileRelationsDao.findAllProfileAndOrganizationRelationsByUser(profile, user);
  }

  /**
   * Finds all user relations of a profile entity.
   *
   * @throws DocumentNotFoundException if profile does not exist
   * @param identity
   */
  async findAllUserProfileRelations(
    identity: DocumentIdentity<Profile>
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

  private async findProfileByIdentity(identity: DocumentIdentity<Profile>) {
    const profile =
      identity instanceof Profile ? identity : await this.profileDao.findById(identity);
    if (!profile) throw new DocumentNotFoundException();
    return profile;
  }
}
