import { User, UserEmail, UserTestDataUtils } from '@/users';
import {
  UserRole,
  ProfileMembershipRole,
  ProfileType,
  ProfileVisibilityLevel,
  UserStatus,
} from '@lyvely/interface';
import { InjectModel } from '@nestjs/mongoose';
import {
  GroupProfile,
  ICreateProfileOptions,
  Membership,
  Organization,
  Profile,
  ProfilesFactory,
  UserProfile,
  UserProfileRelation,
} from '../schemas';
import { ProfileContext, ProtectedProfileContext } from '../contexts';
import { createBaseDocumentInstance, createObjectId, Model } from '@/core';
import { getObjectId as mongoSeedingGetObjectId } from 'mongo-seeding';

export class ProfileTestDataUtils extends UserTestDataUtils {
  @InjectModel(Profile.name)
  protected ProfileModel: Model<Profile>;

  @InjectModel(UserProfileRelation.name)
  protected UserProfileRelationModel: Model<UserProfileRelation>;

  @InjectModel(Membership.name)
  protected MembershipModel: Model<Membership>;

  async createUserAndProfile(
    username = 'test',
    password = 'test',
    email?: string
  ): Promise<{ user: User; profile: UserProfile; context: ProtectedProfileContext }> {
    const user = await this.createUser(username, { password, email });
    const profile = await this.createProfile(user);
    const context = new ProtectedProfileContext({
      user,
      profile,
      relations: [
        Membership.create({
          user,
          profile,
          role: ProfileMembershipRole.Owner,
        }),
      ],
    });
    return { user, profile, context };
  }

  async createSimpleOrganization(
    options: Partial<ICreateProfileOptions> = {},
    owner?: User,
    member?: User
  ) {
    owner ??= await this.createUser('owner', { role: UserRole.Admin });
    member ??= await this.createUser('member');

    const organization = await this.createProfile(
      owner,
      options.name || 'TestOrg',
      ProfileType.Organization,
      options.visibility || ProfileVisibilityLevel.Member,
      options
    );
    await this.addProfileMember(organization, member);

    const ownerContext = new ProtectedProfileContext<Organization>({
      user: owner,
      profile: organization,
      relations: [
        Membership.create({
          user: owner,
          profile: organization,
          role: ProfileMembershipRole.Owner,
        }),
      ],
    });

    const memberContext = new ProtectedProfileContext<Organization>({
      user: member,
      profile: organization,
      relations: [
        Membership.create({
          user: member,
          profile: organization,
          role: ProfileMembershipRole.Member,
        }),
      ],
    });

    return {
      owner,
      ownerContext,
      member,
      memberContext,
      organization: organization as Organization,
    };
  }

  override async createUser(username = 'test', userData: Partial<User> = {}): Promise<User> {
    userData.username = username;
    userData.displayName ??= username;
    userData.email = userData.email || `${username}@test.de`;
    userData.emails ||= [
      new UserEmail(`${username}@test.de`, true),
      new UserEmail(`uv_${username}@test.de`, false),
      new UserEmail(`alt_${username}@test.de`, true),
    ];
    userData.password = userData.password || `testPassword`;
    userData.status = userData.status ?? UserStatus.Active;
    const user = new this.UserModel(new User(userData));
    await user.save();
    return new User(user);
  }

  async createSimpleGroup(
    visibility: ProfileVisibilityLevel = ProfileVisibilityLevel.Member,
    options: Partial<ICreateProfileOptions> = {},
    organization?: Organization,
    owner?: User,
    member?: User
  ) {
    owner ??= await this.createUser('owner');
    member ??= await this.createUser('member');
    const profile = await this.createGroupProfile(
      owner,
      options.name || 'TestGroup',
      visibility,
      options
    );

    await this.addProfileMember(profile, member);

    const ownerContext = new ProtectedProfileContext({
      user: owner,
      profile,
      organizationContext: organization
        ? this.createOrganizationContext(owner, organization, ProfileMembershipRole.Owner)
        : undefined,
      relations: [
        Membership.create({
          user: owner,
          profile,
          role: ProfileMembershipRole.Owner,
        }),
      ],
    });

    const memberContext = new ProtectedProfileContext({
      user: member,
      profile,
      organizationContext: organization
        ? this.createOrganizationContext(member, organization, ProfileMembershipRole.Member)
        : undefined,
      relations: [
        Membership.create({
          user: member,
          profile,
          role: ProfileMembershipRole.Member,
        }),
      ],
    });

    return { owner, ownerContext, member, memberContext, profile };
  }

  createOrganizationContext(
    user: User,
    organization: Organization,
    role: ProfileMembershipRole = ProfileMembershipRole.Member
  ) {
    return new ProtectedProfileContext<Organization>({
      user,
      profile: organization,
      relations: [
        Membership.create({
          user,
          profile: organization,
          role,
        }),
      ],
    });
  }

  /**
   * @deprecated use createSimpleGroup instead
   */
  async createSmallGroup(): Promise<{
    owner: User;
    ownerContext: ProfileContext;
    user: User;
    group: Profile;
  }> {
    const { user: owner, context } = await this.createUserAndProfile();
    const { user } = await this.createUserAndProfile('user2');
    const group = await this.createGroupProfile(user);
    await this.addProfileMember(group, user);
    return { owner, ownerContext: context, user, group };
  }

  async createGroupProfile(
    owner: User,
    name?: string,
    visibility: ProfileVisibilityLevel = ProfileVisibilityLevel.Member,
    options: Partial<ICreateProfileOptions> = {}
  ): Promise<Profile> {
    const profile = await this.createProfile(owner, name, ProfileType.Group, visibility, options);
    return new Profile(owner, profile);
  }

  async createSubProfile(
    owner: User,
    organization: Organization,
    type: ProfileType = ProfileType.User,
    visibility: ProfileVisibilityLevel = ProfileVisibilityLevel.Member,
    options: Partial<ICreateProfileOptions> = {}
  ): Promise<Profile> {
    return this.createProfile(owner, options.name || 'subProfile', type, visibility, {
      organization,
      ...options,
    });
  }

  async createProfile(
    owner: User,
    name?: string,
    type: ProfileType = ProfileType.User,
    visibility: ProfileVisibilityLevel = ProfileVisibilityLevel.Member,
    options: Partial<ICreateProfileOptions> = {}
  ): Promise<Profile> {
    const profile = await this._createProfile(
      ProfilesFactory.createProfile(
        owner,
        Object.assign({}, options, {
          type,
          name: name || owner.username,
          handle: options.handle || name || owner.username,
          visibility: visibility,
        })
      )
    );

    await this.addProfileMember(profile, owner, ProfileMembershipRole.Owner);

    switch (type) {
      case ProfileType.User:
        return new UserProfile(owner, profile);
      case ProfileType.Organization:
        return new Organization(owner, profile);
      case ProfileType.Group:
        return new GroupProfile(owner, profile);
      default:
        return new Profile(owner, profile);
    }
  }

  private async _createProfile(profile: Profile) {
    return createBaseDocumentInstance(Profile, await new this.ProfileModel(profile).save());
  }

  async addProfileRelation(
    profile: Profile,
    user: User,
    type: string,
    role: string
  ): Promise<UserProfileRelation> {
    return new this.UserProfileRelationModel(
      UserProfileRelation.create({
        user: user,
        profile: profile,
        type: type,
        role: role,
      })
    ).save();
  }

  async addProfileMember(
    profile: Profile,
    user: User,
    role: ProfileMembershipRole = ProfileMembershipRole.Member
  ): Promise<Membership> {
    return new this.MembershipModel(
      Membership.create({
        user: user,
        profile: profile,
        role: role,
      })
    ).save();
  }

  static createDummyUserAndProfile(
    userData: Partial<User> = {},
    profileData: Partial<Profile> = {}
  ) {
    const user = this.createDummyUser(userData);
    const profile = this.createDummyProfile(user, profileData);
    return { user, profile };
  }

  static createDummyUser(data: Partial<User> = {}) {
    data.username = data.username || 'User1';
    data._id = getObjectId(data.username);
    data.email = data.email || `${data.username}@test.de`;
    data.password = data.password || 'testPassword';
    return new User(data);
  }

  static createDummyProfile(owner: User, data: Partial<Profile> = {}) {
    data.ownerId = owner._id;
    data.name ??= `${owner.username}Profile`;
    data.handle ??= data.name;
    data._id = getObjectId(data.name);
    data.type = data.type ?? ProfileType.User;
    return new Profile(owner, data);
  }
}
// We use this to prevent circular dependency
function getObjectId(seed: string) {
  return createObjectId(mongoSeedingGetObjectId(seed).toString());
}
