import { Injectable } from '@nestjs/common';
import { UserRegistrationDto, isValidEmail, IFieldValidationResult, escapeHTML, UserStatus } from '@lyvely/common';
import { UserDao, User } from '../../users';
import { ProfilesService } from '../../profiles';
import { MailService } from '@/modules/mails';
import { ConfigService } from '@nestjs/config';
import { EntityValidationException, UrlGenerator, ConfigurationPath } from '@/modules/core';
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

    if (emailValidation.errors?.includes('user_registration.errors.email_unique')) {
      await this.sendEmailAlreadyExistsMail(registerDto.email);
      throw new EntityValidationException([emailValidation]);
    } else if (emailValidation.errors?.length) {
      throw new EntityValidationException([emailValidation]);
    }

    const user = await this.userDao.save(
      new User({
        username: registerDto.username,
        email: registerDto.email,
        status: UserStatus.EmailVerification,
        locale: registerDto.locale,
        password: registerDto.password,
      }),
    );

    await Promise.all([this.profileService.createDefaultUserProfile(user), this.sendEmailConfirmationMail(user)]);

    return user;
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
        secret: this.configService.get('auth.jwt.verify.secret'),
        expiresIn: this.configService.get('auth.jwt.verify.expiresIn'),
      },
    );

    const verifyHref = escapeHTML(this.urlGenerator.getApiUrl('/user-registration/verify-email', { token }).href);

    // TODO: (i18n) missing translation
    return this.mailerService.sendMail({
      to: user.email,
      subject: 'Email verification',
      partials: {
        headline: 'Confirm Your Email Address',
        body: `<p>Hi, ${username}</p>
           <p>Welcome to <b>${appName}</b></p>
           <p>Please click the button below to verify your email address.</p>
           <p>
             <a rel="noopener" target="_blank" href="${verifyHref}" style="background-color: #059669; font-size: 14px; font-family: Helvetica, Arial, sans-serif; font-weight: bold; text-decoration: none; padding: 6px 12px; color: #ffffff; border-radius: 5px; display: inline-block; mso-padding-alt: 0;">
               <span style="mso-text-raise: 15pt;">Verify Email</span>
             </a>
           </p>
           <small>If you did not sign up to ${appName}, please ignore this email or contact us at <a href="${contactMailHref}">${contactMail}</a></small>`,
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
