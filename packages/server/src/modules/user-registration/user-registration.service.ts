import { BadRequestException, Injectable } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { UserRegistrationDto, isValidEmail } from '@lyvely/common';
import { UserDao, User } from '../users';
import { UserWithProfileAndRelations, ProfilesService } from '../profiles';
import { MailService } from '../mails/services/mail.service';
import { IFieldValidationResult } from '@lyvely/common/src';

@Injectable()
export class UserRegistrationService {
  constructor(private userDao: UserDao, private profileService: ProfilesService, private mailerService: MailService) {}

  /**
   * Creates a user
   *
   * @param {UserRegistrationDto} registerDto username, email, and password. Username and email must be
   * unique, will throw an email with a description if either are duplicates
   * @returns {Promise<UserDocument>} or throws an error
   * @memberof UsersService
   */
  async register(registerDto: UserRegistrationDto): Promise<UserWithProfileAndRelations> {
    try {
      const user = await this.userDao.save(
        new User({
          username: registerDto.username,
          email: registerDto.email,
          locale: registerDto.locale,
          password: registerDto.password,
        }),
      );
      const result = await this.profileService.createDefaultUserProfile(user);
      this.mailerService.sendMail({
        to: registerDto.email,
        subject: 'Testing...',
        html: '<b>Testing...</b>',
      });
      return result;
    } catch (error) {
      throw this.evaluateMongoRegistrationError(error, registerDto);
    }
  }

  async validateEmail(email: string): Promise<IFieldValidationResult> {
    const result: IFieldValidationResult = { property: 'email', isError: false };
    if (!isValidEmail(email)) {
      result.isError = true;
      result.errors = ['user_registration.invalid_email'];
      return result;
    }

    if (this.userDao.emailExists()) {
    }

    return result;
  }

  private evaluateMongoRegistrationError(error: MongoError, createUserInput: UserRegistrationDto): Error {
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
