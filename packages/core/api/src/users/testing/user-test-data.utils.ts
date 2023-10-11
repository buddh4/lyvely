import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserEmail } from '../schemas';
import { UserStatus } from '@lyvely/core-interface';

@Injectable()
export class UserTestDataUtils {
  @InjectModel(User.name)
  protected UserModel: Model<UserDocument>;

  async createUser(username = 'test', userData: Partial<User> = {}): Promise<User> {
    userData.username = username;
    userData.email = userData.email || `${username}@test.de`;
    userData.emails ||= [
      new UserEmail(`${username}@test.de`, true),
      new UserEmail(`uv_${username}@test.de`, false),
      new UserEmail(`alt_${username}@test.de`, true),
    ];
    userData.password = userData.password || `testPassword`;
    userData.status ??= UserStatus.Active;
    const user = new this.UserModel(new User(userData));
    await user.save();
    return new User(user);
  }
}
