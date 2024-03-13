import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  FieldValidationException,
  ForbiddenServiceException,
  UserRegistration,
  UserRegistrationMode,
  UserStatus,
  OtpInfo,
  VerifyEmailDto,
} from '@lyvely/interface';
import { escapeHTML } from '@lyvely/common';
import { OtpService } from '@/otp';
import { UserDao, User, UsersService } from '@/users';
import { ProfileContext, ProfilesService } from '@/profiles';
import { MailService } from '@/mails';
import { ConfigService } from '@nestjs/config';
import { ConfigurationPath } from '@/config';
import { InvitationsService, IMailInvitation } from '@/user-invitations';
import { SystemMessagesService } from '@/system-messages';
import { validate } from 'class-validator';
import { I18n } from '@/i18n';

const OTP_PURPOSE_VERIFY_REGISTRATION_EMAIL = 'verify-registration-email';

@Injectable()
export class UserRegistrationService {
  constructor(
    private userDao: UserDao,
    private profileService: ProfilesService,
    private userService: UsersService,
    private mailerService: MailService,
    private configService: ConfigService<ConfigurationPath & any>,
    private userOtpService: OtpService,
    private invitationsService: InvitationsService,
    private systemMessageService: SystemMessagesService,
    private i18n: I18n,
  ) {}

  /**
   * Creates and returns a new user record. If the user email is already in use this function will return null.
   *
   * Note: By default, usernames are not unique.
   *
   * @param {UserRegistration} userRegistration username, email, and password. Email must be
   * unique, will throw an email with a description if either are duplicates
   * @returns {Promise<OtpInfo>} or throws an error
   * @memberof UsersService
   */
  async register(userRegistration: UserRegistration): Promise<OtpInfo> {
    this.validateRegistrationMode();

    const invitation = await this.getAndValidateInvitation(userRegistration);
    const user = await this.createAndValidateUser(userRegistration);

    const { otp, otpModel } = await this.createOrUpdateEmailVerificationOtp(user);

    await Promise.all([
      this.createDefaultUserProfile(user),
      this.sendEmailVerificationMail(user, otp),
      this.handleInvitation(user, invitation),
    ]);

    return otpModel.getOtpClientInfo();
  }

  /**
   * Creates a default user profile for the given user and adds a greeting system message content entry.
   * @param user
   * @private
   */
  private async createDefaultUserProfile(user: User) {
    const context = await this.profileService.createDefaultUserProfile(user);
    return this.systemMessageService.createContent(context, {
      text: 'profiles.intro.private_first',
    });
  }

  /**
   * In case the registration happened due to an invitation, we mark the invitation as accepted.
   * @param user
   * @param invitation
   * @private
   */
  private async handleInvitation(user, invitation?: IMailInvitation) {
    if (!invitation) return;
    return this.invitationsService.acceptInvitation(user, invitation);
  }

  /**
   * This function checks if registrations are allowed based on the configuration.
   * @private
   */
  private validateRegistrationMode() {
    const registrationMode = this.getRegistrationMode();
    if (registrationMode === 'none') throw new ForbiddenServiceException();
  }

  /**
   * Creates a user instance in case the data in the user registration is valid.
   * The validation includes validating the email and username for correctness and uniqueness.
   * The created user will have a status of `EmailVerification`.
   * @param userRegistration
   * @private
   */
  private async createAndValidateUser(userRegistration: UserRegistration) {
    await Promise.all([
      this.validateUserName(userRegistration.username),
      this.validateEmail(userRegistration.email),
    ]);
    return this.userDao.save(
      new User({
        username: userRegistration.username,
        email: userRegistration.email,
        status: UserStatus.EmailVerification,
        locale: userRegistration.locale,
        password: userRegistration.password,
      }),
    );
  }

  /**
   * Returns true in case the username is valid and does not already exist, otherwise throws an FieldValidationException.
   * @param username
   * @throws FieldValidationException if user is invalid or does already exist
   */
  async validateUserName(username: string): Promise<boolean> {
    const validationModel: UserRegistration = Object.assign(Object.create(UserRegistration), {
      username,
    });
    const errors = await validate(validationModel, {
      skipMissingProperties: true,
    });

    if (errors.length) {
      throw new FieldValidationException([
        { property: 'username', errors: ['user-registration.username.invalid'] },
      ]);
    }

    const user = await this.userDao.findByUsername(username);
    if (user) {
      throw new FieldValidationException([
        { property: 'username', errors: ['user-registration.username.taken'] },
      ]);
    }

    return true;
  }

  /**
   * Returns true in case the email is valid and does not already exist, otherwise throws an FieldValidationException.
   * @param email
   * @throws FieldValidationException if user is invalid or does already exist
   */
  async validateEmail(email: string): Promise<boolean> {
    const validationModel: UserRegistration = Object.assign(Object.create(UserRegistration), {
      email,
    });
    const errors = await validate(validationModel, { skipMissingProperties: true });

    if (errors.length) {
      throw new FieldValidationException([
        { property: 'email', errors: ['user-registration.email.invalid'] },
      ]);
    }

    const user = await this.userDao.findByVerifiedEmail(email, true);
    if (user) {
      throw new FieldValidationException([
        { property: 'email', errors: ['user-registration.email.taken'] },
      ]);
    }

    return true;
  }

  /**
   * Returns the configured registration mode, which is PUBLIC by default, which means users can register without an
   * invitation.
   * @private
   */
  private getRegistrationMode() {
    return this.configService.get<UserRegistrationMode>(
      'userRegistration.mode',
      UserRegistrationMode.PUBLIC,
    );
  }

  /**
   * Checks if there is an existing invitation for this registration request and also validates if invitations are not
   * disabled by configuration.
   * If the registration mode equals 'invite' it only accepts the registration if we find an existing invite related
   * to the registration.
   * @param userRegistration
   * @private
   */
  private async getAndValidateInvitation(userRegistration: UserRegistration) {
    const invitationContext = await this.invitationsService.getMailInvitationContext(
      userRegistration.inviteToken!,
    );

    if (
      this.getRegistrationMode() === 'invite' &&
      !(await this.invitationsService.validateMailInvitationContext(invitationContext!))
    ) {
      throw new ForbiddenServiceException();
    }

    return invitationContext?.invitation;
  }

  /**
   * Sends out the OTP email verification mail to the given user.
   * @param user
   * @param otp
   * @private
   */
  private async sendEmailVerificationMail(user: User, otp: string) {
    const appName = escapeHTML(this.configService.get('appName')!);
    const contactMailHref = escapeHTML(
      encodeURI(`mailto:${this.configService.get('contactMail')}`),
    );
    const contactMail = escapeHTML(this.configService.get('contactMail')!);

    const i18n = this.i18n.translation('user-registration', user);

    return this.mailerService.sendMail({
      to: user.email,
      subject: i18n.t('email-verification.subject'),
      partials: {
        headline: i18n.t('email-verification.headline'),
        body: `<p>${i18n.t('email-verification.guide', { appName })}</p>
           <p>
             <div style="margin-left:50px;margin-right:50px;margin-bottom:30px">
               <div style="text-align:center;vertical-align:middle;font-size:30px">${otp}</div>
             </div>
           </p>
           <p>
             <small>${i18n.t('email-verification.disclaimer', { appName })}</small>
           </p>
           <p>
             <small>${i18n.t('email-verification.contact', {
               appName,
               contactLink: `<a href="${contactMailHref}">${contactMail}</a>`,
             })}</small>
           </p>`,
      },
    });
  }

  /**
   * This function is used to regenerate a new otp.
   * @param emailOrUsername
   * @param remember defines if the user session should be renewed automatically
   */
  async resendOtp(emailOrUsername: string, remember?: boolean) {
    const user = await this.findUserByEmailOrUsername(emailOrUsername);
    const { otp, otpModel } = await this.createOrUpdateEmailVerificationOtp(user, remember);
    await this.sendEmailVerificationMail(user, otp);
    return otpModel.getOtpClientInfo();
  }

  /**
   * Creates or overwrites an existing otp entity for the given user with the given remember setting.
   * @param user
   * @param remember defines if the user session should be renewed automatically
   * @private
   */
  private async createOrUpdateEmailVerificationOtp(user: User, remember?: boolean) {
    return this.userOtpService.createOrUpdateUserOtp(user, {
      purpose: OTP_PURPOSE_VERIFY_REGISTRATION_EMAIL,
      remember: remember,
    });
  }

  /**
   * Verifies the given OTP verification request against an existing otp in the database.
   * @param verifyEmail
   */
  async verifyEmail(verifyEmail: VerifyEmailDto) {
    const user = await this.findUserByEmailOrUsername(verifyEmail.emailOrUsername);

    const { isValid, remember } = await this.userOtpService.runValidation(
      user,
      OTP_PURPOSE_VERIFY_REGISTRATION_EMAIL,
      verifyEmail.otp,
    );

    if (!isValid) throw new UnauthorizedException();

    await Promise.all([
      this.userService.setUserStatus(user, UserStatus.Active),
      this.userDao.setEmailVerification(user, user.email, true),
    ]);

    return { user, remember };
  }

  /**
   * Finds a user by email or username and if not found throws an `UnauthorizedException`.
   * @param emailOrUsername
   * @throws UnauthorizedException in case the user could not be found
   * @private
   */
  private async findUserByEmailOrUsername(emailOrUsername: string) {
    const user = await this.userService.findUserByUsernameOrMainEmail(emailOrUsername);

    if (!user) throw new UnauthorizedException();

    if (user.status !== UserStatus.EmailVerification) throw new UnauthorizedException();
    return user;
  }
}
