import { Injectable } from '@nestjs/common';
import { OptionalUser, User } from '@/users';
import {
  CalendarPreferences,
  ProfileMembershipRole,
  ProfileType,
  ProfileUsage,
  ProfileVisibilityLevel,
  UpdateProfileModel,
  VALID_HANDLE_REGEX,
  DocumentNotFoundException,
  UniqueConstraintException,
  MisconfigurationException,
} from '@lyvely/interface';
import { MembershipsDao, ProfileDao } from '../daos';
import { ProfileContext, ProtectedProfileContext } from '../models';
import {
  assureObjectId,
  assureStringId,
  Connection,
  EntityIdentity,
  InjectConnection,
  withTransaction,
} from '@/core';
import {
  ICreateProfileOptions,
  ICreateProfileTypeOptions,
  Organization,
  Profile,
  ProfilesFactory,
  UserProfileRelation,
} from '../schemas';
import { ProfileMembershipService } from './profile-membership.service';
import { ProfileRelationsService } from './profile-relations.service';
import { ISettingUpdate } from '@/settings';
import { isDefined } from 'class-validator';
import {
  USER_SETTING_CALENDAR_PREFERENCE_WEEKSTART,
  USER_SETTING_CALENDAR_PREFERENCE_YEARSTART,
} from '@/user-account/user-account.constants';
import { ProfileSettingsService } from './profile-settings.service';
import { ConfigService } from '@nestjs/config';
import { ConfigurationPath } from '@/config';

@Injectable()
export class ProfilesService {
  constructor(
    private profileDao: ProfileDao,
    private configService: ConfigService<ConfigurationPath>,
    private membershipDao: MembershipsDao,
    private membershipService: ProfileMembershipService,
    private relationsService: ProfileRelationsService,
    private profileSettingsService: ProfileSettingsService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  /**
   * Creates a default user profile based on the given user's information.
   * If a profile with the same name already exists for the user, it returns the existing profile.
   * Otherwise, it creates a new profile using the user's username and locale and other information.
   * This function is usually called after the registration or first visit of a user.
   * @param owner The user for whom the profile is being created.
   * @returns A Promise resolving to the protected profile context of the created or found profile.
   */
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
   * Creates a new user profile with the provided options.
   * Ensures that the profile name is unique for the organization (if any) or the owner.
   * If a locale is not provided, it uses the locale of the organization (if any) or the user.
   * @param owner The user who will own the profile.
   * @param options Options for creating the profile.
   * @returns A Promise resolving to the protected profile context of the created profile.
   * @throws UniqueConstraintException If a profile with the same name already exists for the owner.
   */
  async createUserProfile(
    owner: User,
    options: ICreateProfileOptions,
  ): Promise<ProtectedProfileContext> {
    await this.checkProfileNameUniqueness(owner, options);
    options.locale ??= options.organization?.locale || owner.locale;
    return this.createProfile(owner, Object.assign({}, options, { type: ProfileType.User }));
  }

  /**
   * Creates a new group profile with the provided options.
   * Ensures that the profile name is unique for the organization (if any) or the owner.
   * If a locale is not provided, it uses the locale of the organization (if any) or the user.
   * @param owner The user who will own the profile.
   * @param options Options for creating the profile.
   * @returns A Promise resolving to the protected profile context of the created profile.
   * @throws UniqueConstraintException If a profile with the same name already exists for the owner.
   */
  async createGroupProfile(
    owner: User,
    options: ICreateProfileOptions,
  ): Promise<ProtectedProfileContext> {
    await this.checkProfileNameUniqueness(owner, options);
    options.locale = options.locale || options.organization?.locale || owner.locale;
    return this.createProfile(owner, Object.assign({}, options, { type: ProfileType.Group }));
  }

  /**
   * Checks if the name of the given profile is unique either within the organization (if any) or the owner of the profile
   * if it is not an organization profile.
   * @param owner The user who will own the profile.
   * @param options Options for creating the profile.
   * @throws UniqueConstraintException in case the profile name is already used by the organization or owner.
   * @private
   */
  private async checkProfileNameUniqueness(owner: User, options: ICreateProfileOptions) {
    const profile = options.organization
      ? await this.profileDao.findOneByOrganizationAndName(options.organization, options.name)
      : await this.profileDao.findOneByOwnerAndName(owner, options.name);

    if (profile) {
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
  }

  /**
   * Creates a new organization profile with the provided options.
   * Ensures that the organization name not already in use.
   * If a locale is not provided, it uses the locale of the organization (if any) or the user.
   * @param owner The user who will own the profile.
   * @param options Options for creating the profile.
   * @returns A Promise resolving to the protected profile context of the created profile.
   * @throws UniqueConstraintException If a profile with the same name already exists for the owner.
   */
  async createOrganization(
    owner: User,
    options: Omit<ICreateProfileOptions, 'organization'>,
  ): Promise<ProtectedProfileContext> {
    if (await this.profileDao.findExistingProfileByOrganizationName(owner, options.name)) {
      throw new UniqueConstraintException(
        'name',
        'Can not create organization, name is already in use',
      );
    }

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

      let profile = ProfilesFactory.createProfile(owner, options);
      profile.handle = await this.findUniqueHandle(profile);

      if (owner.settings?.calendar) {
        profile.settings.calendar = owner.settings.calendar;
      }

      profile = await this.profileDao.save(profile, transaction);

      const membership = await this.membershipService.createMembership(
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

  /**
   * Finds a unique handle for the given profile by following the following preferences:
   *
   * - If a handle was assigned to the profile which does not exist, we use the already assigned handle.
   * - If the profile name does not exist as handle, we use the already assigned handle.
   * - If the profile name with a timestamp does not exist, we use the timestamped profile name.
   * - Otherwise we simply use the guid.
   *
   * Note, this function does not set the handle.
   * @param profile The profile to create a new handle for.
   * @private
   */
  private async findUniqueHandle(profile: Profile): Promise<string> {
    const { name, guid, handle } = profile;

    const fallBackHandle = profile.name + Date.now();
    const handles = [name, fallBackHandle];
    if (handle) handles.push(handle);

    const profiles = await this.profileDao.findByHandles(handles);

    if (handle?.match(VALID_HANDLE_REGEX) && !profiles.find((p) => p.handle === handle)) {
      return handle;
    }

    if (name?.match(VALID_HANDLE_REGEX) && !profiles.find((p) => p.handle === name)) {
      return name;
    }

    if (name?.match(VALID_HANDLE_REGEX) && !profiles.find((p) => p.handle === fallBackHandle)) {
      return fallBackHandle;
    }

    return guid;
  }

  /**
   * Returns the default profile of the given user. Which profile is chosen depends on the default profile strategy,
   * this could for example be a static configured profile, the latest visited profile or a profile marked as default.
   *
   * @param user
   */
  async findDefaultProfile(user: OptionalUser): Promise<ProfileContext> {
    if (!user) {
      return this.findDefaultVisitorProfile();
    }

    const membership = await this.membershipDao.findOldestRelation(user);

    // TODO: check if profile is archived etc.
    if (!membership) {
      return this.createDefaultUserProfile(user);
    }

    const profileContext = await this.findProfileContext(user, membership.pid);

    // TODO: handle integrity issue if !relation, at least do some logging here...
    return profileContext ? profileContext : this.createDefaultUserProfile(user);
  }

  async findDefaultVisitorProfile(): Promise<ProfileContext> {
    const visitorStrategy = this.configService.get('permissions.visitorStrategy');
    if (!visitorStrategy?.handles?.length) {
      throw new MisconfigurationException('No visitor profile set.');
    }

    return this.findProfileContextByHandle(null, visitorStrategy.handles[0]);
  }

  /**
   * Returns a profile with the given id or null if the profile could not be found.
   * If `throwsException` is set to true, this function will throw a DocumentNotFoundException in case the profile
   * could not be found.
   * @param identity the identity of the profile.
   * @param throwsException if set to true, throws an exception in case the profile could not be found.
   * @throws DocumentNotFoundException if throwsExceptio is set to true and the profile could not be found.
   */
  async findProfileById(
    identity: EntityIdentity<Profile> | null | undefined,
    throwsException = false,
  ): Promise<Profile | null> {
    if (!identity && throwsException) throw new DocumentNotFoundException('Profile not found.');
    if (!identity) return null;

    const result =
      identity instanceof Profile ? identity : await this.profileDao.findById(identity);

    if (!result && throwsException) {
      throw new DocumentNotFoundException('Profile not found.');
    }

    return result;
  }

  /**
   * Returns a profile with the given handle or null if the profile could not be found.
   * If `throwsException` is set to true, this function will throw a DocumentNotFoundException in case the profile
   * could not be found.
   * @param handle the unique profile handle.
   * @param throwsException if set to true, throws an exception in case the profile could not be found.
   * @throws DocumentNotFoundException if throwsExceptio is set to true and the profile could not be found.
   */
  async findProfileByHandle(handle: string, throwsException = false): Promise<Profile | null> {
    if (!handle && throwsException) throw new DocumentNotFoundException('Profile not found.');
    if (!handle) return null;

    const result = await this.profileDao.findByHandle(handle);

    if (!result && throwsException) {
      throw new DocumentNotFoundException('Profile not found.');
    }

    return result;
  }

  /**
   * Updates the profile details with the provided update data.
   * Note: Changes to the profile type are currently ignored.
   * @param profile The profile to be updated.
   * @param update The update data containing the fields to be updated.
   * @returns A Promise resolving to a boolean value indicating whether the update was successful.
   */
  async updateProfile(profile: Profile, update: UpdateProfileModel): Promise<boolean> {
    const updateData = { ...update };

    // Currently we ignore profile type changes
    delete updateData.type;

    return this.profileDao.updateOneSetById(profile, updateData);
  }

  /**
   * Returns a ProfileContext object, which describes the relation of the given user with the given profile in detail.
   * The ProfileContext is usually used for other services and permission checks.
   * @param user The user of the relation
   * @param pid The profile of the relation
   * @param oid An optional objectId which can be used to optimize the db call if known
   */
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

    // Patch for < v0.2.0
    if (!profile.handle) {
      const handle = await this.findUniqueHandle(profile);
      await this.profileDao.updateOneSetById(profile, { handle });
    }

    return this._createProfileContext(user, profile, organization);
  }

  /**
   * Returns a ProfileContext object, which describes the relation of the given user with the given profile in detail.
   * The ProfileContext is usually used for other services and permission checks.
   * @param user The user of the relation.
   * @param handle The profile of the relation.
   */
  async findProfileContextByHandle(user: User, handle: string): Promise<ProtectedProfileContext>;
  async findProfileContextByHandle(user: OptionalUser, handle: string): Promise<ProfileContext>;
  async findProfileContextByHandle(user: OptionalUser, handle: string): Promise<ProfileContext> {
    const { profile, organization } = await this.findProfileWithOrganizationByHandle(handle);
    return this._createProfileContext(user, profile, organization);
  }

  /**
   * Creates a profile context with relation and organization relation.
   * @param user
   * @param profile
   * @param organization
   */
  private async _createProfileContext(
    user: User,
    profile: Profile,
    organization?: Organization | null,
  ): Promise<ProtectedProfileContext>;
  private async _createProfileContext(
    user: OptionalUser,
    profile: Profile,
    organization?: Organization | null,
  ): Promise<ProfileContext>;
  private async _createProfileContext(
    user: OptionalUser,
    profile: Profile,
    organization?: Organization | null,
  ): Promise<ProfileContext> {
    const { profileRelations, organizationRelations } =
      await this.relationsService.findAllProfileAndOrganizationRelationsByUser(profile, user);

    if (!user) {
      const organizationContext = organization
        ? new ProfileContext<Organization>({ profile: organization })
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

  /**
   * Finds a profile and related organization (if any) by given handle.
   * @param handle The profile handle.
   */
  async findProfileWithOrganizationByHandle(
    handle: string,
  ): Promise<{ profile: Profile; organization: Organization | null }> {
    const profile = await this.profileDao.findByHandle(handle);
    let organization: Organization | null = null;
    if (!profile) throw new DocumentNotFoundException();

    if (profile.hasOrg) {
      organization = await this.profileDao.findById(profile.oid);
    }

    return { profile, organization };
  }

  /**
   * Finds a profile and its associated organization (if any) based on provided profile and organization identities.
   * - If both profile and organization identities are provided and they are not instances of Profile, it will fetch them from the database.
   * - If they are instances of Profile, it will use them directly.
   * - If only the profile is provided and it has an associated organization, it will fetch the organization.
   * - If only the profile identity is provided, it will fetch the profile.
   * It ensures that the fetched organization actually belongs to the profile.
   * @param pid The identity (or instance) of the profile. Could be an ObjectId, string, or a Profile instance.
   * @param oid Optional identity (or instance) of the organization. Could be an ObjectId, string, or a Profile instance.
   * @returns A Promise resolving to an object containing the profile and its organization (or null if there isn’t any).
   * @throws DocumentNotFoundException if the profile cannot be found.
   */
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
      organization = profiles.find(
        (p) => p.type === ProfileType.Organization && p._id.equals(assureObjectId(oid)),
      );
    } else if (pid instanceof Profile && oid instanceof Profile) {
      // Both already instances
      profile = pid;
      organization = oid;
    } else if (pid instanceof Profile && pid.hasOrganization()) {
      // Pid is an instance, we ignore oid here since we trust the profiles pid more
      profile = pid;
      organization = await this.profileDao.findByTypeAndId(profile.oid, ProfileType.Organization);
    } else if (pid instanceof Profile) {
      profile = pid;
    } else {
      profile = await this.profileDao.findById(pid);
    }

    if (!profile) throw new DocumentNotFoundException();

    // Make sure we have the right organization here
    if (profile.hasOrganization() && !profile.isProfileOfOrganization(organization)) {
      organization = await this.profileDao.findByTypeAndId(profile.oid, ProfileType.Organization);
    }

    if (!profile) throw new DocumentNotFoundException();

    return { profile, organization: organization || null };
  }

  /**
   * Returns a profile context array describing the profile context between the given profile and the given users.
   * @param identity The profile of the contexts
   * @param users The users of the contexts
   * @param skipEmptyRelations If set to true will exclude contexts without existing user relations
   */
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

    const relations = await this.relationsService.findAllProfileRelationsByUsers(
      assureObjectId(profile),
      uids,
    );

    relations.forEach((relation) => {
      profileContextMap.get(assureStringId(relation.uid)!)?.relations.push(relation);
    });

    const result = Array.from(profileContextMap.values());
    return skipEmptyRelations
      ? result.filter((profileContext) => !!profileContext.relations.length)
      : result;
  }

  /**
   * Finds all profile contexts of the given user.
   * @param user
   */
  async findAllProfileContextsByUser(user: User): Promise<ProtectedProfileContext[]> {
    const userRelations = await this.relationsService.findAllProfileRelationsByUser(user);

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
   * Increments the score of the given profile.
   * @param identity The identity (or instance) of the profile. Could be an ObjectId, string, or a Profile instance.
   * @param inc The amount to increment.
   */
  async incrementScore(identity: EntityIdentity<Profile>, inc: number): Promise<number> {
    const profile = await this.findProfileById(identity, true);

    if (!profile) throw new DocumentNotFoundException();

    if (inc === 0) return profile.score;

    const newScore = Math.max(profile.score + inc, 0);
    await this.profileDao.updateOneSetById(profile, { score: newScore });
    return newScore;
  }

  /**
   * Sets calendar preference settings of this profile.
   * @param profile
   * @param preferences
   */
  async setCalendarPreferences(
    profile: Profile,
    preferences: CalendarPreferences,
  ): Promise<Record<string, any>> {
    const update: ISettingUpdate = [];

    const { weekStart, yearStart } = preferences;

    if (isDefined(weekStart)) {
      update.push({ key: USER_SETTING_CALENDAR_PREFERENCE_WEEKSTART, value: weekStart });
    }

    if (isDefined(yearStart)) {
      update.push({ key: USER_SETTING_CALENDAR_PREFERENCE_YEARSTART, value: yearStart });
    }

    await this.profileSettingsService.updateSettings(profile, update);
    return profile.settings;
  }
}
