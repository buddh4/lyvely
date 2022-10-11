import { Inject, Injectable, Optional } from '@nestjs/common';
import { InjectModel, MongooseModuleOptions } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from '../../users';
import { ProfileType, ProfileVisibilityLevel, BaseMembershipRole } from '@lyvely/common';
import { closeInMongodConnection, rootMongooseTestModule } from './mongoose-test.utils';
import {
  Profile,
  ProfileDocument,
  UserProfileRelation,
  UserProfileRelationDocument,
  Membership,
  MembershipDocument,
  ProfileContext,
  ProfilesFactory,
  Organization,
  UserProfile,
  GroupProfile,
} from '../../profiles';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { getObjectId as mongoSeedingGetObjectId } from 'mongo-seeding';
import { createBaseEntityInstance } from '@/modules/core';

@Injectable()
export class TestDataUtils {
  @InjectModel(Profile.name)
  protected ProfileModel: Model<ProfileDocument>;

  @InjectModel(User.name)
  protected UserModel: Model<UserDocument>;

  @InjectModel(UserProfileRelation.name)
  protected UserProfileRelationModel: Model<UserProfileRelationDocument>;

  @InjectModel(Membership.name)
  protected MembershipModel: Model<MembershipDocument>;

  @Optional()
  @Inject()
  private eventEmitter: EventEmitter2;

  async createUserAndProfile(
    username = 'test',
    password = 'test',
    email?: string,
  ): Promise<{ user: User; profile: UserProfile; profileRelations: ProfileContext }> {
    const user = await this.createUser(username, { password, email });
    const profile = await this.createProfile(user);
    const profileRelations = new ProfileContext({
      user,
      profile,
      relations: [Membership.create({ user, profile, role: BaseMembershipRole.Owner })],
    });
    return { user, profile, profileRelations };
  }

  async createSimpleOrganization(
    name = 'TestOrganization',
  ): Promise<{ owner: User; member: User; organization: Profile }> {
    const { user: owner } = await this.createUserAndProfile('owner');
    const { user: member } = await this.createUserAndProfile('member');

    const organization = await this.createProfile(owner, name, ProfileType.Organization);
    await this.addProfileMember(organization, member);

    return { owner, member, organization };
  }

  async createUser(username = 'test', userData: Partial<User> = {}): Promise<User> {
    userData.username = username;
    userData.email = userData.email || `${username}@test.de`;
    userData.password = userData.password || `testPassword`;
    const user = new this.UserModel(new User(userData));
    await user.save();
    return new User(user);
  }

  async createSimpleGroup(
    visibility: ProfileVisibilityLevel = ProfileVisibilityLevel.Member,
  ): Promise<{ owner: User; member: User; profile: GroupProfile }> {
    const { user: owner } = await this.createUserAndProfile('owner');
    const { user: member } = await this.createUserAndProfile('member');
    const profile = await this.createGroupProfile(owner, 'TestGroup', visibility);

    await this.addProfileMember(profile, member);

    return { owner, member, profile };
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
  ): Promise<Profile> {
    const profile = await this._createProfile(
      new Profile(owner, {
        name: name || owner.username,
        visibility: visibility,
        type: ProfileType.Group,
      }),
    );

    await this.addProfileMember(profile, owner, BaseMembershipRole.Owner);

    return new Profile(owner, profile);
  }

  async createProfile(
    owner: User,
    name?: string,
    type: ProfileType = ProfileType.User,
    visibility: ProfileVisibilityLevel = ProfileVisibilityLevel.Member,
  ): Promise<Profile> {
    const profile = await this._createProfile(
      ProfilesFactory.createProfile(owner, {
        type,
        name: name || owner.username,
        visibility: visibility,
      }),
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

  async addProfileRelation(profile: Profile, user: User, type: string, role: string): Promise<UserProfileRelation> {
    return new this.UserProfileRelationModel(
      UserProfileRelation.create({
        user: user,
        profile: profile,
        type: type,
        role: role,
      }),
    ).save();
  }

  async addProfileMember(profile: Profile, user: User, role: string = BaseMembershipRole.Member): Promise<Membership> {
    return new this.MembershipModel(
      Membership.create({
        user: user,
        profile: profile,
        role: role,
      }),
    ).save();
  }

  static getMongooseTestModule(key: string, options: MongooseModuleOptions = {}) {
    return rootMongooseTestModule(key, options);
  }

  static getEventEmitterModule() {
    return EventEmitterModule.forRoot({ wildcard: true });
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

  async reset(key: string) {
    await this.delete();
    if (this.eventEmitter) {
      this.eventEmitter.removeAllListeners();
    }
    await this.closeDBConnection(key);
  }

  async delete() {
    await this.MembershipModel.deleteMany({});
    await this.ProfileModel.deleteMany({});
    await this.UserModel.deleteMany({});
    await this.UserProfileRelationModel.deleteMany({});
  }

  async closeDBConnection(key: string) {
    return closeInMongodConnection(key);
  }
}

// We use this to prevent circular dependency
function getObjectId(id: string) {
  return <TObjectId>new mongoose.Types.ObjectId(mongoSeedingGetObjectId(id).toString());
}
