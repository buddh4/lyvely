import { Injectable } from '@nestjs/common';
import { User, UsersService } from '../../users';
import { EntityIdentity } from '../../../core/db/db.utils';
import { ProfileType } from '@lyvely/common';
import { MembershipsDao, ProfileDao, UserProfileRelationsDao } from '../daos';
import { UserWithProfileAndRelations } from '../models';
import { EntityNotFoundException, UniqueConstraintException } from "../../../core/exceptions";
import { Membership, BaseMembershipRole, Profile, UserProfileRelation,
  CreateProfileOptions, CreateProfileTypeOptions, ProfilesFactory } from "../schemas";

export interface UserToProfileRelation {
  user: User,
  relation: UserProfileRelation,
  profile: Profile
}

export interface ProfileMembership {
  user: User,
  membership: Membership,
  profile: Profile
}

@Injectable()
export class ProfilesService {
  constructor(
    private profileDao: ProfileDao,
    private usersService: UsersService,
    private membershipDao: MembershipsDao,
    private profileRelationsDao: UserProfileRelationsDao
  ) {}

  async createDefaultUserProfile(owner: User): Promise<UserWithProfileAndRelations> {
    const profile = await this.profileDao.findOneByOwnerAndName(owner, owner.username);

    if(profile) {
      return this.findUserProfileRelations(owner, profile);
    }

    return this.createProfile(owner,{
      name: owner.username,
      locale: owner.locale,
      type: ProfileType.User
    });
  }

  /**
   * @param owner
   * @param options
   * @throws UniqueConstraintException
   */
  async createUserProfile(owner: User, options: CreateProfileOptions): Promise<UserWithProfileAndRelations> {
    await this.checkProfileNameUniqueness(owner, options);
    options.locale = options.locale || options.organization?.locale || owner.locale;
    return this.createProfile(owner, Object.assign({}, options, { type: ProfileType.User }));
  }

  async createGroupProfile(owner: User, options: CreateProfileOptions): Promise<UserWithProfileAndRelations> {
    await this.checkProfileNameUniqueness(owner, options);
    options.locale = options.locale || options.organization?.locale || owner.locale;
    return this.createProfile(owner, Object.assign({}, options, { type: ProfileType.Group }));
  }

  private async checkProfileNameUniqueness(owner: User, options: CreateProfileOptions) {
    const profile = options.organization
      ? await this.profileDao.findOneByOrganizationAndName(options.organization, options.name)
      : await this.profileDao.findOneByOwnerAndName(owner, options.name);

    if(profile) this.throwUniqueConstraintExceptionOnCreate(options);
  }

  private throwUniqueConstraintExceptionOnCreate(options: CreateProfileOptions) {
    if(options.organization) {
      throw new UniqueConstraintException('Can not create user profile, profile name already exists in organization', 'name');
    }
    throw new UniqueConstraintException('Can not create user profile, user already owns a profile with this name', 'name');
  }


  async createOrganization(owner: User, options: Omit<CreateProfileOptions, 'organization'>): Promise<UserWithProfileAndRelations> {
    if(await this.profileDao.findOneByOwnerOrOrganizationName(owner, options.name))
      throw new UniqueConstraintException('Can not create organization, name is already in use', 'name');

    options.locale = options.locale || owner.locale;
    return this.createProfile(owner, Object.assign({}, options, { type: ProfileType.Organization }));
  }

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
  protected async createProfile(owner: User, options: CreateProfileTypeOptions): Promise<UserWithProfileAndRelations> {
    const profile = await this.profileDao.save(ProfilesFactory.createProfile(owner, options));

    const [ membership ] = await Promise.all([
      this.membershipDao.addMembership(profile, owner, BaseMembershipRole.Owner),
      this.usersService.incProfileCount(owner, profile.type)
    ])

    return new UserWithProfileAndRelations({ user: owner, profile: profile, relations: [membership] });
  }

  async findAllUserProfileRelations(profile: EntityIdentity<Profile>): Promise<UserProfileRelation[]> {
    return this.profileRelationsDao.findAllByProfile(profile);
  }

  async findUserProfileRelations(user: User, identity: EntityIdentity<Profile>): Promise<UserWithProfileAndRelations> {
    const relations = await this.profileRelationsDao.findAllByUserAndProfile(user, identity);
    const profile =  identity instanceof Profile ? identity : await this.profileDao.findById(identity);
    return new UserWithProfileAndRelations({ user, profile, relations });
  }

  async findProfileRelationsByUser(user: User): Promise<UserWithProfileAndRelations[]> {
    const userRelations = await this.profileRelationsDao.findAllByUser(user);

    if(!userRelations.length) return [];

    const profiles = await this.profileDao.findAllByIds(userRelations.map(relation => relation.pid));
    return profiles.map(profile => new UserWithProfileAndRelations({
      user,
      profile,
      relations: userRelations.filter(relation => relation.pid.equals(profile._id))
    }));
  }

  /**
   * Returns a single profile for the given user. Which profile is chosen depends on the default profile strategy,
   * this could for example be a static configured profile, the latest visited profile or a profile marked as default.
   *
   * @param user
   */
  async findDefaultProfileMembershipByUser(user: User): Promise<UserWithProfileAndRelations|null> {
    // TODO: make sure not to return an archived profile
    const memberships = await this.membershipDao.findAllByUser(user);

    if(!memberships.length) {
      // Todo: maybe create a default profile here?
      return null;
    }

    return this.findUserProfileRelations(user, memberships[0].pid);
  }

  async incrementScore(identity: EntityIdentity<Profile>, inc: number): Promise<number> {
    if(inc === 0) {
      return;
    }

    const profile = await this.findProfileById(identity, true);
    const newScore = Math.max(profile.score + inc, 0);
    await this.profileDao.updateOneSetById(profile, { score: newScore });
    return newScore;
  }

  async findProfileById(identity: EntityIdentity<Profile>, throwsException = false): Promise<Profile|undefined> {
    const result = identity instanceof Profile ? identity : await this.profileDao.findById(identity);

    if(!result && throwsException) {
      throw new EntityNotFoundException('Profile not found.');
    }

    return result;
  }
}
