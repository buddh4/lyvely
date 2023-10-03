import { User, UserEmail, UserStatus, UserTestDataUtils } from '@lyvely/users';
import { InjectModel } from '@nestjs/mongoose';
import {
  GroupProfile,
  ICreateProfileOptions,
  Membership,
  MembershipDocument,
  Organization,
  Profile,
  ProfileDocument,
  ProfilesFactory,
  UserProfile,
  UserProfileRelation,
  UserProfileRelationDocument,
} from '../schemas';
import { ProfileUserContext } from '../models';
import mongoose, { Model } from 'mongoose';
import { getObjectId as mongoSeedingGetObjectId } from 'mongo-seeding';
import {
  BaseMembershipRole,
  ProfileType,
  ProfileVisibilityLevel,
} from '@lyvely/profiles-interface';
import { createBaseEntityInstance } from '@lyvely/core';

export class ProfileTestDataUtils extends UserTestDataUtils {
  @InjectModel(Profile.name)
  protected ProfileModel: Model<ProfileDocument>;

  @InjectModel(UserProfileRelation.name)
  protected UserProfileRelationModel: Model<UserProfileRelationDocument>;

  @InjectModel(Membership.name)
  protected MembershipModel: Model<MembershipDocument>;

  async createUserAndProfile(
    username = 'test',
    password = 'test',
    email?: string,
  ): Promise<{ user: User; profile: UserProfile; context: ProfileUserContext }> {
    const user = await this.createUser(username, { password, email });
    const profile = await this.createProfile(user);
    const context = new ProfileUserContext({
      user,
      profile,
      relations: [
        Membership.create({
          user,
          profile,
          role: BaseMembershipRole.Owner,
        }),
      ],
    });
    return { user, profile, context };
  }

  async createSimpleOrganization(
    options: Partial<ICreateProfileOptions> = {},
    owner?: User,
    member?: User,
  ) {
    owner ??= await this.createUser('owner');
    member ??= await this.createUser('member');

    const organization = await this.createProfile(
      owner,
      options.name || 'TestOrg',
      ProfileType.Organization,
      options.visibility || ProfileVisibilityLevel.Member,
      options,
    );
    await this.addProfileMember(organization, member);

    const ownerContext = new ProfileUserContext<Organization>({
      user: owner,
      profile: organization,
      relations: [
        Membership.create({
          user: owner,
          profile: organization,
          role: BaseMembershipRole.Owner,
        }),
      ],
    });

    const memberContext = new ProfileUserContext<Organization>({
      user: member,
      profile: organization,
      relations: [
        Membership.create({
          user: member,
          profile: organization,
          role: BaseMembershipRole.Member,
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

  async createUser(username = 'test', userData: Partial<User> = {}): Promise<User> {
    userData.username = username;
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
    member?: User,
  ) {
    owner ??= await this.createUser('owner');
    member ??= await this.createUser('member');
    const profile = await this.createGroupProfile(owner, 'TestGroup', visibility, options);

    await this.addProfileMember(profile, member);

    const ownerContext = new ProfileUserContext({
      user: owner,
      profile,
      organizationContext: organization
        ? this.createOrganizationContet(owner, organization, BaseMembershipRole.Owner)
        : undefined,
      relations: [
        Membership.create({
          user: owner,
          profile,
          role: BaseMembershipRole.Owner,
        }),
      ],
    });

    const memberContext = new ProfileUserContext({
      user: member,
      profile,
      organizationContext: organization
        ? this.createOrganizationContet(member, organization, BaseMembershipRole.Member)
        : undefined,
      relations: [
        Membership.create({
          user: member,
          profile,
          role: BaseMembershipRole.Member,
        }),
      ],
    });

    return { owner, ownerContext, member, memberContext, profile };
  }

  createOrganizationContet(
    user: User,
    organization: Organization,
    role: BaseMembershipRole = BaseMembershipRole.Member,
  ) {
    return new ProfileUserContext<Organization>({
      user,
      profile: organization,
      relations: [
        Membership.create({
          user,
          profile: organization,
          role: BaseMembershipRole.Member,
        }),
      ],
    });
  }

  /**
   * @deprecated use createSimpleGroup instead
   */
  async createSmallGroup(): Promise<{ owner: User; user: User; group: Profile }> {
    const { user: owner } = await this.createUserAndProfile();
    const { user } = await this.createUserAndProfile('user2');
    const group = await this.createGroupProfile(user);
    await this.addProfileMember(group, user);
    return { owner, user, group };
  }

  async createGroupProfile(
    owner: User,
    name?: string,
    visibility: ProfileVisibilityLevel = ProfileVisibilityLevel.Member,
    options: Partial<ICreateProfileOptions> = {},
  ): Promise<Profile> {
    const profile = await this.createProfile(owner, name, ProfileType.Group, visibility, options);

    await this.addProfileMember(profile, owner, BaseMembershipRole.Owner);

    return new Profile(owner, profile);
  }

  async createProfile(
    owner: User,
    name?: string,
    type: ProfileType = ProfileType.User,
    visibility: ProfileVisibilityLevel = ProfileVisibilityLevel.Member,
    options: Partial<ICreateProfileOptions> = {},
  ): Promise<Profile> {
    const profile = await this._createProfile(
      ProfilesFactory.createProfile(
        owner,
        Object.assign({}, options, {
          type,
          name: name || owner.username,
          visibility: visibility,
        }),
      ),
    );

    await this.addProfileMember(profile, owner, BaseMembershipRole.Owner);

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
    return createBaseEntityInstance(Profile, await new this.ProfileModel(profile).save());
  }

  async addProfileRelation(
    profile: Profile,
    user: User,
    type: string,
    role: string,
  ): Promise<UserProfileRelation> {
    return new this.UserProfileRelationModel(
      UserProfileRelation.create({
        user: user,
        profile: profile,
        type: type,
        role: role,
      }),
    ).save();
  }

  async addProfileMember(
    profile: Profile,
    user: User,
    role: string = BaseMembershipRole.Member,
  ): Promise<Membership> {
    return new this.MembershipModel(
      Membership.create({
        user: user,
        profile: profile,
        role: role,
      }),
    ).save();
  }

  static createDummyUserAndProfile(userData: Partial<User> = {}) {
    const user = this.createDummyUser(userData);
    const profile = this.createDummyProfile(user);
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
    data.name = data.name || `${owner.username}Profile`;
    data._id = getObjectId(data.name);
    data.type = data.type ?? ProfileType.User;
    return new Profile(owner, data);
  }
}
// We use this to prevent circular dependency
function getObjectId(id: string) {
  return new mongoose.Types.ObjectId(mongoSeedingGetObjectId(id).toString());
}
