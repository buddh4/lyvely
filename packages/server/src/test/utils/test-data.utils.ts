import { Inject, Injectable, Optional } from '@nestjs/common';
import { InjectModel, MongooseModuleOptions } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from '../../users';
import { ProfileType, ProfileVisibilityLevel } from '@lyvely/common';
import { closeInMongodConnection, rootMongooseTestModule } from './mongoose-test.utils';
import {
  Profile, ProfileDocument,
  BaseMembershipRole,
  UserProfileRelation,
  UserProfileRelationDocument,
  Membership, MembershipDocument
} from '../../profiles';
import { EventEmitter2, EventEmitterModule  } from '@nestjs/event-emitter';
import { getObjectId as mongoSeedingGetObjectId } from 'mongo-seeding';

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

  async createUserAndProfile(username = 'test', password = 'test', email?: string): Promise<{user: User, profile: Profile}> {
    const user = await this.createUser(username, password, email);
    const profile = await this.createProfile(user);
    return { user: user, profile: profile }
  }

  async createUser(username = 'test', password = 'test', email?: string): Promise<User> {
    const user = new this.UserModel();
    user.username = username;
    user.password = password;
    user.email = email ?? `${username}@test.de`;
    await user.save();
    return new User(user.toObject());
  }

  async createSimpleGroup(visibility: ProfileVisibilityLevel = ProfileVisibilityLevel.Member): Promise<{owner: User, member: User, profile: Profile}> {
    const { user: owner } = await this.createUserAndProfile('owner');
    const { user: member } = await this.createUserAndProfile('member');
    const profile = await this.createGroupProfile(owner, 'TestGroup', visibility);

    await this.addProfileMember(profile, member);

    return { owner, member, profile };
  }

  /**
   * @deprecated use createSimpleGroup instead
   */
  async createSmallGroup(): Promise<{owner: User, user: User, group: Profile}> {
    const { user: owner } = await this.createUserAndProfile();
    const { user } = await this.createUserAndProfile('user2');
    const group = await this.createGroupProfile(user);
    await this.addProfileMember(group, user);
    return { owner, user, group };
  }

  async createGroupProfile(owner: User, name?: string, visibility: ProfileVisibilityLevel = ProfileVisibilityLevel.Member): Promise<Profile> {
    const profile = await new this.ProfileModel({
      createdBy: owner._id,
      name: name || owner.username,
      visibility: visibility,
      type: ProfileType.Group
    }).save();

    await this.addProfileMember(profile, owner, BaseMembershipRole.Owner);

    return new Profile(profile);
  }

  async createProfile(owner: User, name?: string, type: ProfileType = ProfileType.User, visibility: ProfileVisibilityLevel = ProfileVisibilityLevel.Member): Promise<Profile> {
    const profile = await new this.ProfileModel({
      createdBy: owner._id,
      name: name || owner.username,
      visibility: visibility,
      type: type
    }).save();

    await this.addProfileMember(profile, owner, BaseMembershipRole.Owner);

    return new Profile(profile);
  }

  async addProfileRelation(profile: Profile, user: User, type: string, role: string): Promise<UserProfileRelation> {
    return new this.UserProfileRelationModel(UserProfileRelation.create({
      user: user,
      profile: profile,
      type: type,
      role: role
    })).save();
  }

  async addProfileMember(profile: Profile, user: User, role: string = BaseMembershipRole.Member): Promise<Membership> {
    return new this.MembershipModel(Membership.create({
      user: user,
      profile: profile,
      role: role,
    })).save();
  }

  static getMongooseTestModule(key: string, options: MongooseModuleOptions = {}) {
    return rootMongooseTestModule(key, options)
  }

  static getEventEmitterModule() {
    return EventEmitterModule.forRoot({ wildcard: true });
  }

  static createDummyUserAndProfile(userData: Partial<User> = {}) {
    const user = this.createDummyUser(userData);
    const profile = this.createDummyProfile(user);
    return { user, profile }
  }

  static createDummyUser(data: Partial<User> = {}) {
    data.username = data.username || 'User1';
    data._id = getObjectId(data.username);
    data.email = data.email || `${data.username}@test.de`;
    data.password = data.password || 'testPassword';
    return new User(data);
  }

  static createDummyProfile(owner: User, data: Partial<Profile> = {}) {
    data.createdBy = owner._id;
    data.name = data.name || `${owner.username}Profile`;
    data._id = getObjectId(data.name);
    data.type = data.type ?? ProfileType.User;
    return new Profile(data);
  }

  async reset(key: string) {
    await this.delete();
    if(this.eventEmitter) {
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
  return <mongoose.Types.ObjectId> new mongoose.Types.ObjectId(mongoSeedingGetObjectId(id).toString());
}
