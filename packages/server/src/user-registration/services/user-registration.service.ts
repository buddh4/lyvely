import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  FieldValidationException,
  UserRegistration,
  isValidEmail,
  escapeHTML,
  UserStatus,
  UniqueConstraintException,
  VerifyEmailDto,
  OtpInfo,
  RegistrationMode,
  ForbiddenServiceException,
} from '@lyvely/common';
import { UserDao, User, UsersService } from '@/users';
import { ProfilesService } from '@/profiles';
import { MailService } from '@/mails';
import { ConfigService } from '@nestjs/config';
import { UrlGenerator, ConfigurationPath } from '@/core';
import { UserOtpService } from '@/user-otp';
import { InvitationsService } from '@/invitations/services/invitations.service';
import { Invitation } from '@/invitations';
import { SystemMessagesService } from '@/system-messages';

const OTP_PURPOSE_VERIFY_REGISTRATION_EMAIL = 'verify-registration-email';

@Injectable()
export class UserRegistrationService {
  constructor(
    private userDao: UserDao,
    private profileService: ProfilesService,
    private userService: UsersService,
    private mailerService: MailService,
    private configService: ConfigService<ConfigurationPath & any>,
    private urlGenerator: UrlGenerator,
    private userOtpService: UserOtpService,
    private invitationsService: InvitationsService,
    private systemMessageService: SystemMessagesService,
  ) {}

  /**
   * Creates and returns a new user record. If the user email is already in use this function will return null.
   *
   * Note: By default, usernames are not unique.
   *
   * @param {UserRegistration} userRegistration username, email, and password. Email must be
   * unique, will throw an email with a description if either are duplicates
   * @returns {Promise<UserDocument>} or throws an error
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
      this.invalidateInvitations(user, invitation),
    ]);

    return otpModel.getOtpClientInfo();
  }

  private async createDefaultUserProfile(user: User) {
    const { profile } = await this.profileService.createDefaultUserProfile(user);
    return this.systemMessageService.createContent(profile, user, {
      text: 'profiles.intro.private_first',
    });
  }

  private invalidateInvitations(user, invitation?: Invitation) {
    if (invitation) {
      this.invitationsService.acceptInvitation(user, invitation);
    }
  }

  private validateRegistrationMode() {
    const registrationMode = this.getRegistrationMode();
    if (registrationMode === 'none') throw new ForbiddenServiceException();
  }

  private async createAndValidateUser(userRegistration: UserRegistration) {
    try {
      await this.validateEmail(userRegistration.email);
      return this.userDao.save(
        new User({
          username: userRegistration.username,
          email: userRegistration.email,
          status: UserStatus.EmailVerification,
          locale: userRegistration.locale,
          password: userRegistration.password,
        }),
      );
    } catch (err: any) {
      if (err instanceof UniqueConstraintException) {
        await this.sendEmailAlreadyExistsMail(userRegistration.email);
      }
      throw err;
    }
  }

  private getRegistrationMode() {
    return this.configService.get<RegistrationMode>('userRegistration.mode', 'public');
  }

  private async getAndValidateInvitation(userRegistration: UserRegistration) {
    const invitationMetadata = await this.invitationsService.getInvitationMetadata(
      userRegistration.inviteToken,
    );

    if (
      this.getRegistrationMode() === 'invite' &&
      !(await this.invitationsService.validateInvitationMetadata(invitationMetadata))
    ) {
      throw new ForbiddenServiceException();
    }

    return invitationMetadata?.invitation;
  }

  private async sendEmailAlreadyExistsMail(email: string) {
    // TODO: (i18n) missing translation
    const appName = escapeHTML(this.configService.get('appName'));
    const forgotPasswordUrl = escapeHTML(
      encodeURI(this.urlGenerator.getAppUrl({ path: '/reset-password' }).href),
    );
    return this.mailerService.sendMail({
      to: email,
      subject: `Attempt to register an already existing email`,
      partials: {
        headline: 'Forgot your password?',
        body: `<p>An attempt has been made to register a new account on ${appName} with this already registered email address.
          In case you tried to access your account, but forgot your password, please use the 
          <a href="${forgotPasswordUrl}">Forgot password</a> feature.
          Otherwise, just ignore this email.</p>`,
      },
    });
  }

  private async sendEmailVerificationMail(user: User, otp: string) {
    const appName = escapeHTML(this.configService.get('appName'));
    const contactMailHref = escapeHTML(
      encodeURI(`mailto:${this.configService.get('contactMail')}`),
    );
    const contactMail = escapeHTML(this.configService.get('contactMail'));

    // TODO: (i18n) missing translation
    return this.mailerService.sendMail({
      to: user.email,
      subject: 'Email verification',
      partials: {
        headline: 'Confirm your email address',
        body: `<p>Please enter the confirmation code below in the browser window where you've started to sign up for ${appName}</p>
           <p>
             <div style="margin-left:50px;margin-right:50px;margin-bottom:30px">
               <div style="text-align:center;vertical-align:middle;font-size:30px">${otp}</div>
             </div>
           </p>
           <p>
             <small>If you did not sign up to ${appName}, please ignore this email.</small>
           </p>
           <p>
             <small>In case you have any questions about setting up ${appName}, contact us at <a href="${contactMailHref}">${contactMail}</a></small>
           </p>`,
      },
    });
  }

  private async validateEmail(email: string) {
    if (!isValidEmail(email)) {
      throw new FieldValidationException([{ property: 'email', errors: ['validation.isEmail'] }]);
    }

    if (await this.userDao.findByVerifiedEmail(email, true)) {
      throw new UniqueConstraintException('email', 'Email already in use');
    }
  }

  async resendOtp(email: string, remember?: boolean) {
    const user = await this.findEmailVerificationUserByEmail(email);
    const { otp, otpModel } = await this.createOrUpdateEmailVerificationOtp(user, remember);
    await this.sendEmailVerificationMail(user, otp);
    return otpModel.getOtpClientInfo();
  }

  private async createOrUpdateEmailVerificationOtp(user: User, remember?: boolean) {
    return this.userOtpService.createOrUpdateUserOtp(user, {
      purpose: OTP_PURPOSE_VERIFY_REGISTRATION_EMAIL,
      remember: remember,
    });
  }

  async verifyEmail(verifyEmail: VerifyEmailDto) {
    const user = await this.findEmailVerificationUserByEmail(verifyEmail.email);

    const { isValid, remember } = await this.userOtpService.runValidation(
      user,
      OTP_PURPOSE_VERIFY_REGISTRATION_EMAIL,
      verifyEmail.otp,
    );

    if (!isValid) throw new UnauthorizedException();

    await Promise.all([
      this.userService.setUserStatus(user, UserStatus.Active),
      this.userDao.setEmailVerification(user, verifyEmail.email, true),
    ]);

    return { user, remember };
  }

  private async findEmailVerificationUserByEmail(email: string) {
    const user = await this.userService.findUserByMainEmail(email);

    if (!user) throw new UnauthorizedException();

    if (user.status !== UserStatus.EmailVerification) throw new UnauthorizedException();
    return user;
  }
}
