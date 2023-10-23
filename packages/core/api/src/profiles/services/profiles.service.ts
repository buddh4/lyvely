import { Injectable } from '@nestjs/common';
import { OptionalUser, User, UsersService } from '@/users';
import {
  ProfileMembershipRole,
  ProfileType,
  ProfileUsage,
  ProfileVisibilityLevel,
} from '@lyvely/core-interface';
import { EntityNotFoundException, UniqueConstraintException } from '@lyvely/common';
import { MembershipsDao, ProfileDao, UserProfileRelationsDao } from '../daos';
import { ProfileContext, ProfileRelations, ProtectedProfileContext } from '../models';
import {
  assureObjectId,
  assureStringId,
  EntityIdentity,
  Transaction,
  withTransaction,
  InjectConnection,
  Connection,
} from '@/core';
import {
  ICreateProfileOptions,
  ICreateProfileTypeOptions,
  Organization,
  Profile,
  ProfilesFactory,
  UserProfileRelation,
} from '../schemas';

@Injectable()
export class ProfilesService {
  constructor(
    private profileDao: ProfileDao,
    private usersService: UsersService,
    private membershipDao: MembershipsDao,
    private profileRelationsDao: UserProfileRelationsDao,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async createDefaultUserProfile(owner: User): Promise<ProtectedProfileContext> {
    const profile = await this.profileDao.findOneByOwnerAndName(owner, owner.username);

    if (profile) {
      return this.findProfileContext(owner, profile);
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
  async createUserProfile(
    owner: User,
    options: ICreateProfileOptions,
  ): Promise<ProtectedProfileContext> {
    await this.checkProfileNameUniqueness(owner, options);
    options.locale = options.locale || options.organization?.locale || owner.locale;
    return this.createProfile(owner, Object.assign({}, options, { type: ProfileType.User }));
  }

  async createGroupProfile(
    owner: User,
    options: ICreateProfileOptions,
  ): Promise<ProtectedProfileContext> {
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
        'name',
        'Can not create user profile, profile name already exists in organization',
      );
    }
    throw new UniqueConstraintException(
      'name',
      'Can not create user profile, user already owns a profile with this name',
    );
  }

  async createOrganization(
    owner: User,
    options: Omit<ICreateProfileOptions, 'organization'>,
  ): Promise<ProtectedProfileContext> {
    if (await this.profileDao.findOneByOwnerOrOrganizationName(owner, options.name))
      throw new UniqueConstraintException(
        'name',
        'Can not create organization, name is already in use',
      );

    options.locale = options.locale || owner.locale;
    return this.createProfile(
      owner,
      Object.assign({}, options, { type: ProfileType.Organization }),
    );
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
  protected async createProfile(
    owner: User,
    options: ICreateProfileTypeOptions,
  ): Promise<ProtectedProfileContext> {
    return withTransaction(this.connection, async (transaction) => {
      // TODO (profile visibility) implement max profile visibility in configuration (default member)
      options.visibility = ProfileVisibilityLevel.Member;
      const profile = await this.profileDao.save(
        ProfilesFactory.createProfile(owner, options),
        transaction,
      );

      const membership = await this.createMembership(
        profile,
        owner,
        ProfileMembershipRole.Owner,
        transaction,
      );

      return new ProtectedProfileContext({
        user: owner,
        profile: profile,
        relations: [membership],
      });
    });
  }

  async createMembership(
    profile: Profile,
    member: User,
    role: ProfileMembershipRole = ProfileMembershipRole.Member,
    transaction?: Transaction,
  ) {
    const existingMembership = await this.membershipDao.findByProfileAndUser(
      profile,
      member,
      transaction,
    );

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

  async findProfileRelations(
    user: OptionalUser,
    identity: EntityIdentity<Profile>,
  ): Promise<ProfileRelations> {
    const profile =
      identity instanceof Profile ? identity : await this.profileDao.findById(identity);

    if (!profile) throw new EntityNotFoundException();

    if (!user) return new ProfileRelations({ profile });

    const profileRelations = await this.profileRelationsDao.findAllByProfile(identity);
    const userRelations = profileRelations.filter((relation) => relation.uid.equals(user._id));
    return new ProfileRelations({ user, profile, profileRelations, userRelations });
  }

  async findProfileContext(
    user: User,
    pid: EntityIdentity<Profile>,
    oid?: EntityIdentity<Organization>,
  ): Promise<ProtectedProfileContext>;
  async findProfileContext(
    user: OptionalUser,
    pid: EntityIdentity<Profile>,
    oid?: EntityIdentity<Organization>,
  ): Promise<ProfileContext>;
  async findProfileContext(
    user: OptionalUser,
    pid: EntityIdentity<Profile>,
    oid?: EntityIdentity<Organization>,
  ): Promise<ProfileContext> {
    const { profile, organization } = await this.findProfileWithOrganization(pid, oid);

    const { profileRelations, organizationRelations } =
      await this.profileRelationsDao.findAllProfileAndOrganizationRelationsByUser(user, profile);

    if (!user) {
      const organizationContext = organization
        ? new ProfileContext<Organization>({ organization })
        : undefined;
      return new ProfileContext({
        profile,
        organizationContext,
      });
    }

    const organizationContext = organization
      ? new ProtectedProfileContext<Organization>({
          user,
          profile: organization,
          relations: organizationRelations,
        })
      : undefined;

    return new ProtectedProfileContext({
      user,
      profile,
      relations: profileRelations,
      organizationContext,
    });
  }

  async findProfileWithOrganization(
    pid: EntityIdentity<Profile>,
    oid?: EntityIdentity<Profile>,
  ): Promise<{ profile: Profile; organization: Organization | null }> {
    let profile: Profile | undefined | null = null;
    let organization: Organization | undefined | null = null;

    if (!(pid instanceof Profile) && oid && !(oid instanceof Profile)) {
      // Both ids
      const profiles = await this.profileDao.findAllByIds([pid, oid]);
      profile = profiles.find((p) => p._id.equals(assureObjectId(pid)));
      organization = profiles.find((p) => p._id.equals(assureObjectId(oid)));
    } else if (pid instanceof Profile && oid instanceof Profile) {
      // Both already instances
      profile = pid;
      organization = oid;
    } else if (pid instanceof Profile && pid.hasOrganization()) {
      // Pid is an instance, we ignore oid here since we trust the profiles pid more
      profile = pid;
      organization = <Organization | null>await this.profileDao.findById(profile.oid);
    } else if (pid instanceof Profile) {
      profile = pid;
    } else {
      profile = await this.profileDao.findById(pid);
    }

    if (!profile) throw new EntityNotFoundException();

    // Make sure we have the right organization here
    if (profile.hasOrganization() && !profile.isProfileOfOrganization(organization)) {
      organization = <Organization | null>await this.profileDao.findById(profile.oid);
    }

    if (!profile) throw new EntityNotFoundException();

    return { profile, organization: organization || null };
  }

  async findProfileContextsByUsers(
    identity: EntityIdentity<Profile>,
    users: User[],
    skipEmptyRelations = false,
  ): Promise<ProtectedProfileContext[]> {
    if (!users?.length) return [];

    const profile =
      identity instanceof Profile ? identity : await this.profileDao.findById(identity);

    if (!profile) return [];

    const profileContextMap = new Map<string, ProtectedProfileContext>();
    const uids = users.map((user) => {
      profileContextMap.set(
        user.id,
        new ProtectedProfileContext<Profile>({
          user,
          profile,
          relations: [] as UserProfileRelation[],
        }),
      );
      return user._id;
    });

    const relations = await this.profileRelationsDao.findAll({
      pid: assureObjectId(profile),
      uid: { $in: uids },
    });

    relations.forEach((relation) => {
      profileContextMap.get(assureStringId(relation.uid)!)?.relations.push(relation);
    });

    const result = Array.from(profileContextMap.values());
    return skipEmptyRelations
      ? result.filter((profileContext) => !!profileContext.relations.length)
      : result;
  }

  async findAllUserProfileRelations(identity: EntityIdentity<Profile>) {
    const profile =
      identity instanceof Profile ? identity : await this.profileDao.findById(identity);

    if (!profile) return [];

    const userRelations = await this.profileRelationsDao.findAll({
      pid: assureObjectId(identity),
    });

    const result: { user: User; profile: Profile; relations: UserProfileRelation[] }[] = [];
    const uids = userRelations.map((relation) => relation.uid);
    const users = await this.usersService.findUsersById(uids);
    users.forEach((user) => {
      const relations = userRelations.filter((relation) => relation.uid.equals(user._id));
      result.push({ user, profile, relations });
    });

    return result;
  }

  async findAllProfileRelationsByUser(user: User): Promise<UserProfileRelation[]> {
    return this.profileRelationsDao.findAllByUser(user);
  }

  async findAllProfileContextsByUser(user: User): Promise<ProtectedProfileContext[]> {
    const userRelations = await this.findAllProfileRelationsByUser(user);

    if (!userRelations.length) return [];

    const profiles = await this.profileDao.findAllByIds(
      userRelations.map((relation) => relation.pid),
    );

    return profiles.map(
      (profile) =>
        new ProtectedProfileContext({
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
  async findDefaultProfileMembershipByUser(user: User): Promise<ProtectedProfileContext> {
    // TODO: make sure not to return an archived profile
    const memberships = await this.membershipDao.findAllByUser(user);

    if (!memberships.length) {
      return this.createDefaultUserProfile(user);
    }

    const relation = await this.findProfileContext(user, memberships[0].pid);

    // TODO: handle integrity issue if !relation, at least do some logging here...
    return relation ? relation : this.createDefaultUserProfile(user);
  }

  async incrementScore(identity: EntityIdentity<Profile>, inc: number): Promise<number> {
    const profile = await this.findProfileById(identity, true);

    if (!profile) throw new EntityNotFoundException();

    if (inc === 0) return profile.score;

    const newScore = Math.max(profile.score + inc, 0);
    await this.profileDao.updateOneSetById(profile, { score: newScore });
    return newScore;
  }

  async findProfileById(
    identity: EntityIdentity<Profile> | null | undefined,
    throwsException = false,
  ): Promise<Profile | null> {
    if (!identity && throwsException) throw new EntityNotFoundException('Profile not found.');
    if (!identity) return null;

    const result =
      identity instanceof Profile ? identity : await this.profileDao.findById(identity);

    if (!result && throwsException) {
      throw new EntityNotFoundException('Profile not found.');
    }

    return result;
  }
}
