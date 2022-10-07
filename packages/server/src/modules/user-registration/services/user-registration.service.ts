import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRegistrationDto, isValidEmail, IFieldValidationResult, escapeHTML } from '@lyvely/common';
import { UserDao, User } from '../../users';
import { ProfilesService } from '../../profiles';
import { MailService } from '@/modules/mails';
import { ConfigService } from '@nestjs/config';
import { UrlGenerator } from '@/modules/core';
import { ConfigurationPath } from '@/modules/app-config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserRegistrationService {
  constructor(
    private userDao: UserDao,
    private profileService: ProfilesService,
    private mailerService: MailService,
    private configService: ConfigService<ConfigurationPath>,
    private urlGenerator: UrlGenerator,
    private jwtService: JwtService,
  ) {}

  /**
   * Creates a user
   *
   * @param {UserRegistrationDto} registerDto username, email, and password. Username and email must be
   * unique, will throw an email with a description if either are duplicates
   * @returns {Promise<UserDocument>} or throws an error
   * @memberof UsersService
   */
  async register(registerDto: UserRegistrationDto) {
    const emailValidation = await this.validateEmail(registerDto.email);

    if (emailValidation.errors.includes('user_registration.errors.email_unique')) {
      await this.sendEmailAlreadyExistsMail(registerDto.email);
      return;
    } else if (emailValidation.errors.length) {
      throw new BadRequestException(emailValidation.errors);
    }

    const user = await this.userDao.save(
      new User({
        username: registerDto.username,
        email: registerDto.email,
        locale: registerDto.locale,
        password: registerDto.password,
      }),
    );

    const result = await this.profileService.createDefaultUserProfile(user);
    await this.sendEmailConfirmationMail(user);
    return result;
  }

  private async sendEmailAlreadyExistsMail(email: string) {
    // TODO: (i18n) missing translation
    return this.mailerService.sendMail({
      to: email,
      subject: `Attempt to register an already existing email`,
      partials: {
        headline: 'This is a test',
        body:
          '<p>An attempt has been made to register a new account with an already registered email address.' +
          'In case you tried to access your account, but forgot your password, please use the <a href="' +
          this.urlGenerator.getAppUrl('/forgot-password').href +
          '">Forgot password</a> feature.' +
          'Otherwise, just ignore this email.</p>',
      },
    });
  }

  private async sendEmailConfirmationMail(user: User) {
    const username = escapeHTML(user.username);
    const appName = escapeHTML(this.configService.get('appName'));
    const contactMailHref = escapeHTML(encodeURI(`mailto:${this.configService.get('contactMail')}`));
    const contactMail = escapeHTML(this.configService.get('contactMail'));

    // TODO: (security) use one time token
    const token = this.jwtService.sign(
      { sub: user._id.toString(), email: user.email },
      {
        secret: this.configService.get('auth.jwt.token.secret'),
        expiresIn: this.configService.get('auth.jwt.token.expiration'),
      },
    );

    const verifyHref = escapeHTML(this.urlGenerator.getAppUrl('/users/verify-email', { token }).href);

    // TODO: (i18n) missing translation
    return this.mailerService.sendMail({
      to: user.email,
      subject: 'Email verification',
      partials: {
        headline: 'This is a test',
        body: `<p>Hi, ${username}</p>
           <p>Welcome to ${appName}</p>
           <p>Please click the button below to verify your email address.</p>
           <p>If you did not sign up to ${appName}, please ignore this email or contact us at <a href="${contactMailHref}">${contactMail}</a></p>
           <p><a href="${verifyHref}">Verify Email</a></p>`,
      },
    });
  }

  async validateEmail(email: string): Promise<IFieldValidationResult> {
    const result: IFieldValidationResult = { property: 'email', errors: [] };
    if (!isValidEmail(email)) {
      result.errors.push('user_registration.errors.email_invalid');
      return result;
    }

    if (await this.userDao.findByAnyEmail(email)) {
      result.errors.push('user_registration.errors.email_unique');
      return result;
    }

    return result;
  }
}
