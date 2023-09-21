import { Inject, Injectable, Optional } from '@nestjs/common';
import { InjectModel, MongooseModuleOptions } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument, UserEmail } from '../schemas';
import { UserStatus } from '@lyvely/users-interface';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
  getObjectId as mongoSeedingGetObjectId,
} from '@lyvely/testing';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { globalEmitter } from '@lyvely/core';

@Injectable()
export class UserTestDataUtils {
  @InjectModel(User.name)
  protected UserModel: Model<UserDocument>;

  @Optional()
  @Inject()
  private eventEmitter: EventEmitter2;

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

  static getMongooseTestModule(key: string, options: MongooseModuleOptions = {}) {
    return rootMongooseTestModule(key, options);
  }

  static getEventEmitterModule() {
    return EventEmitterModule.forRoot({ wildcard: true });
  }

  static createDummyUser(data: Partial<User> = {}) {
    data.username = data.username || 'User1';
    data._id = getObjectId(data.username);
    data.email = data.email || `${data.username}@test.de`;
    data.password = data.password || 'testPassword';
    return new User(data);
  }

  async reset(key: string) {
    await this.delete();
    if (this.eventEmitter) {
      this.eventEmitter.removeAllListeners();
      globalEmitter.removeAllListeners();
    }
    await this.closeDBConnection(key);
  }

  async delete() {
    await this.UserModel.deleteMany({});
  }

  async closeDBConnection(key: string) {
    return closeInMongodConnection(key);
  }
}

// We use this to prevent circular dependency
function getObjectId(id: string) {
  return new mongoose.Types.ObjectId(mongoSeedingGetObjectId(id).toString());
}
