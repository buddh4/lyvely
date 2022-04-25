import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../users/schemas/users.schema';
import { MongoError } from 'mongodb';
import { RegisterDto } from 'lyvely-common';
import { UserDao } from '../users/daos/user.dao';
import { UserProfileRelations, ProfilesService } from "../profiles";

@Injectable()
export class RegisterService {
  constructor(private userDao: UserDao, private profileService: ProfilesService) {}

  /**
   * Creates a user
   *
   * @param {RegisterDto} registerDto username, email, and password. Username and email must be
   * unique, will throw an email with a description if either are duplicates
   * @returns {Promise<UserDocument>} or throws an error
   * @memberof UsersService
   */
  async register(registerDto: RegisterDto): Promise<UserProfileRelations> {
    try {
      const user = await this.userDao.create(new User({
        username: registerDto.username,
        email: registerDto.email,
        locale: registerDto.locale,
        password: registerDto.password
      }));
      return await this.profileService.createProfile(user);
    } catch (error) {
      throw this.evaluateMongoRegistrationError(error, registerDto);
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
