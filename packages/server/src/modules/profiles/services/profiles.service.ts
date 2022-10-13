import { Injectable } from '@nestjs/common';
import { User, UsersService } from '../../users';
import {
  ProfileType,
  ProfileUsage,
  BaseMembershipRole,
  ProfileVisibilityLevel,
  EntityNotFoundException,
  UniqueConstraintException,
} from '@lyvely/common';
import { MembershipsDao, ProfileDao, UserProfileRelationsDao } from '../daos';
import { ProfileContext } from '../models';
import { EntityIdentity, withTransaction } from '@/modules/core';
import { Profile, ICreateProfileOptions, ICreateProfileTypeOptions, ProfilesFactory } from '../schemas';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class ProfilesService {
  constructor(
    private profileDao: ProfileDao,
    private usersService: UsersService,
    private membershipDao: MembershipsDao,
    private profileRelationsDao: UserProfileRelationsDao,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async createDefaultUserProfile(owner: User): Promise<ProfileContext> {
    const profile = await this.profileDao.findOneByOwnerAndName(owner, owner.username);

    if (profile) {
      return this.findUserProfileRelations(owner, profile);
    }

    return this.createProfile(owner, {
      name: owner.username,
      locale: owner.locale,
      usage: [ProfileUsage.Private],
      type: ProfileType.User,
    });
  }

  /**
   * @param owner
   * @param options
   * @throws UniqueConstraintException
   */
  async createUserProfile(owner: User, options: ICreateProfileOptions): Promise<ProfileContext> {
    await this.checkProfileNameUniqueness(owner, options);
    options.locale = options.locale || options.organization?.locale || owner.locale;
    return this.createProfile(owner, Object.assign({}, options, { type: ProfileType.User }));
  }

  async createGroupProfile(owner: User, options: ICreateProfileOptions): Promise<ProfileContext> {
    await this.checkProfileNameUniqueness(owner, options);
    options.locale = options.locale || options.organization?.locale || owner.locale;
    return this.createProfile(owner, Object.assign({}, options, { type: ProfileType.Group }));
  }

  private async checkProfileNameUniqueness(owner: User, options: ICreateProfileOptions) {
    const profile = options.organization
      ? await this.profileDao.findOneByOrganizationAndName(options.organization, options.name)
      : await this.profileDao.findOneByOwnerAndName(owner, options.name);

    if (profile) this.throwUniqueConstraintExceptionOnCreate(options);
  }

  private throwUniqueConstraintExceptionOnCreate(options: ICreateProfileOptions) {
    if (options.organization) {
      throw new UniqueConstraintException(
        'Can not create user profile, profile name already exists in organization',
        'name',
      );
    }
    throw new UniqueConstraintException(
      'Can not create user profile, user already owns a profile with this name',
      'name',
    );
  }

  async createOrganization(owner: User, options: Omit<ICreateProfileOptions, 'organization'>): Promise<ProfileContext> {
    if (await this.profileDao.findOneByOwnerOrOrganizationName(owner, options.name))
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
  protected async createProfile(owner: User, options: ICreateProfileTypeOptions): Promise<ProfileContext> {
    return withTransaction(this.connection, async (transaction) => {
      // TODO (profile visibility) implement max profile visibility in configuration (default member)
      options.visibility = ProfileVisibilityLevel.Member;
      const profile = await this.profileDao.save(ProfilesFactory.createProfile(owner, options), transaction);

      const [membership] = await Promise.all([
        this.membershipDao.addMembership(profile, owner, BaseMembershipRole.Owner, transaction),
        this.usersService.incrementProfileCount(owner, profile.type, transaction),
      ]);

      return new ProfileContext({ user: owner, profile: profile, relations: [membership] });
    });
  }

  async findUserProfileRelations(user: User, identity: EntityIdentity<Profile>): Promise<ProfileContext> {
    const relations = await this.profileRelationsDao.findAllByUserAndProfile(user, identity);
    const profile = identity instanceof Profile ? identity : await this.profileDao.findById(identity);
    return new ProfileContext({ user, profile, relations });
  }

  async findProfileRelationsByUser(user: User): Promise<ProfileContext[]> {
    const userRelations = await this.profileRelationsDao.findAllByUser(user);

    if (!userRelations.length) return [];

    const profiles = await this.profileDao.findAllByIds(userRelations.map((relation) => relation.pid));
    return profiles.map(
      (profile) =>
        new ProfileContext({
          user,
          profile,
          relations: userRelations.filter((relation) => relation.pid.equals(profile._id)),
        }),
    );
  }

  /**
   * Returns a single profile for the given user. Which profile is chosen depends on the default profile strategy,
   * this could for example be a static configured profile, the latest visited profile or a profile marked as default.
   *
   * @param user
   */
  async findDefaultProfileMembershipByUser(user: User): Promise<ProfileContext> {
    // TODO: make sure not to return an archived profile
    const memberships = await this.membershipDao.findAllByUser(user);

    if (!memberships.length) {
      return this.createDefaultUserProfile(user);
    }

    const relation = await this.findUserProfileRelations(user, memberships[0].pid);

    // TODO: handle integrity issue if !relation, at least do some logging here...
    return relation ? relation : this.createDefaultUserProfile(user);
  }

  async incrementScore(identity: EntityIdentity<Profile>, inc: number): Promise<number> {
    if (inc === 0) {
      return;
    }

    const profile = await this.findProfileById(identity, true);
    const newScore = Math.max(profile.score + inc, 0);
    await this.profileDao.updateOneSetById(profile, { score: newScore });
    return newScore;
  }

  async findProfileById(identity: EntityIdentity<Profile>, throwsException = false): Promise<Profile | undefined> {
    const result = identity instanceof Profile ? identity : await this.profileDao.findById(identity);

    if (!result && throwsException) {
      throw new EntityNotFoundException('Profile not found.');
    }

    return result;
  }
}
