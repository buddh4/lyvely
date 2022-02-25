import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../users/schemas/users.schema';
import { ProfilesService } from '../profiles/services/profiles.service';
import { Profile } from '../profiles/schemas/profiles.schema';
import { MongoError } from 'mongodb';
import { RegisterDto } from 'lyvely-common';
import { UserDao } from '../users/daos/user.dao';

@Injectable()
export class RegisterService {
  constructor(
    private userDao: UserDao,

    private profileService: ProfilesService,
  ) {}

  /**
   * Creates a user
   *
   * @param {RegisterDto} createUserInput username, email, and password. Username and email must be
   * unique, will throw an email with a description if either are duplicates
   * @returns {Promise<UserDocument>} or throws an error
   * @memberof UsersService
   */
  async register(createUserInput: RegisterDto): Promise<{user: User, profile: Profile}> {
    try {
      const user = await this.userDao.create(createUserInput);
      const profile = await this.profileService.createProfile(user, user.username);
      return { profile: profile, user: user };
    } catch (error) {
      throw this.evaluateMongoRegistrationError(error, createUserInput);
    }
  }

  private evaluateMongoRegistrationError(error: MongoError, createUserInput: RegisterDto): Error {
    if (error.code === 11000) {
      if (error.message.toLowerCase().includes(createUserInput.email.toLowerCase())) {
        return new BadRequestException(`e-mail ${createUserInput.email} is already registered`);
      } else if (error.message.toLowerCase().includes(createUserInput.username.toLowerCase())) {
        return new BadRequestException(`Username ${createUserInput.username} is already registered`);
      }
    }
    return new Error(error.message);
  }
}