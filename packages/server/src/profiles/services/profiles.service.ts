import { Injectable } from '@nestjs/common';
import { User } from '../../users/schemas/users.schema';
import { Profile, } from '../schemas/profiles.schema';
import { Category } from '../../categories/schemas/categories.schema';
import { EntityIdentity } from '../../db/db.utils';
import { ProfileType } from '@lyvely/common';
import { ProfileDao } from '../daos/profile.dao';
import { BaseMembershipRole } from '../schemas/user-profile-relations.schema';
import { MembershipsDao } from '../daos/memberships.dao';
import { Membership } from '../schemas/profile-memberships.schema';
import { UserProfileRelations } from '../models/profile-relations.model';
import { UserProfileRelationsDao } from '../daos/user-profile-relations.dao';

export interface ProfileMembership {
  user: User,
  membership: Membership,
  profile: Profile
}

export interface CreateProfileOptions {
  name?: string,
  locale?: string,
  type?: ProfileType
}

@Injectable()
export class ProfilesService {
  constructor(
    public profileDao: ProfileDao,
    private membershipDao: MembershipsDao,
    private profileRelationsDao: UserProfileRelationsDao
  ) {}

  /**
   * Creates a new profile for the given user and with the given profile name and type.
   * If no profile name is given, the default profile name will be used.
   * If no type is given, the profile will be created as private profile.
   *
   * Note, that profile names per owner are unique, this function will return an already existing profile in case
   * another profile with the given name already exists with the same owner.
   *
   * @param owner
   * @param options
   */
  async createProfile(owner: User, options: CreateProfileOptions = {}): Promise<UserProfileRelations> {
    // TODO: validate locale!
    const profile = await this.profileDao.upsert({
      createdBy: owner._id,
      name: options.name || owner.username,
      locale: options.locale || owner.locale,
      type: options.type || ProfileType.User
    });
    const membership = await this.membershipDao.addMembership(profile, owner, BaseMembershipRole.Owner);
    return new UserProfileRelations({ user: owner, profile: profile, relations: [membership] });
  }

  async findUserProfileRelations(user: User, identity: EntityIdentity<Profile>): Promise<UserProfileRelations> {
    const relations = await this.profileRelationsDao.findAllByUserAndProfile(user, identity);
    const profile =  identity instanceof Profile ? identity : await this.profileDao.findById(identity);
    return new UserProfileRelations({ user, profile, relations });
  }

  /**
   * Returns a single profile with membership model in case the given user is member of this profile else null.
   *
   * @param user
   * @param identity
   * @deprecated
   */
  async findProfileMembershipByUserAndId(user: User, identity: EntityIdentity<Profile>): Promise<ProfileMembership|null> {
    const membership = await this.membershipDao.findByUserAndProfile(user, identity);

    if(!membership) {
      return null;
    }

    const profile = identity instanceof Profile ? identity : await this.profileDao.findById(identity);

    if(!profile) {
      console.warn(`Membership without profile: ${membership.id}`);
      return null;
    }

    return { user, membership, profile };
  }

  /**
   * Returns a single profile for the given user. Which profile is chosen depends on the default profile strategy,
   * this could for example be a static configured profile, the latest visited profile or a profile marked as default.
   *
   * @param user
   */
  async findDefaultProfileMembershipByUser(user: User): Promise<ProfileMembership|null> {
    // TODO: implement other strategies here
    // TODO: make sure not to return an archived profile
    const memberships = await this.membershipDao.findAllByUser(user);

    if(!memberships.length) {
      // Todo: maybe create a default profile here?
      return null;
    }

    const membership = memberships[0];

    const profile = await this.profileDao.findById(membership.pid);

    if(!profile) {
      console.warn(`Membership without profile: ${membership.id}`);
      return null;
    }

    return { user, membership, profile };
  }

  async mergeCategories(profile: Profile, categories?: string[]): Promise<Profile> {
    if (!categories || !categories.length) {
      return profile;
    }

    const namesToAdd = categories.filter(
      (name) =>
        name.length &&
        !profile.categories.find((category) => category.name === name),
    );

    const namesToAddSet = new Set<string>(namesToAdd);

    namesToAddSet.forEach((name) =>
      profile.categories.push(Category.create({ name: name })),
    );

    await this.profileDao.updateOneSetById(profile, { categories: profile.categories });

    return profile;
  }

  async updateScore(profile: Profile, inc: number): Promise<number> {
    const newScore = Math.max(profile.score + inc, 0);
    await this.profileDao.updateOneSetById(profile, { score: newScore });
    profile.score = newScore;
    return newScore;
  }

  async findProfileById(identity: EntityIdentity<Profile>): Promise<Profile|undefined> {
    return identity instanceof Profile
      ? identity
      : this.profileDao.findById(identity);
  }
}
