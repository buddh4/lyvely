import { Injectable } from '@nestjs/common';
import { User, UserDao, UserEmail, UserSettingsService } from '@/users';
import { Avatar } from '@/avatars';
import { VerifyEmailDto, OtpInfo, CalendarPreferences } from '@lyvely/interface';
import { InvalidOtpException, OtpService } from '@/otp';
import { EntityIdentity } from '@/core';
import { ConfigurationPath } from '@/config';
import { escapeHTML, FieldValidationException, isValidEmail } from '@lyvely/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@/mails';
import { getEnabledLocales, getTimezones } from '@lyvely/dates';
import { ISettingUpdate } from '@/settings';
import {
  USER_SETTING_CALENDAR_PREFERENCE_YEARSTART,
  USER_SETTING_CALENDAR_PREFERENCE_WEEKSTART,
} from '@/user-accounts/user-accounts.constants';
import { isDefined } from 'class-validator';

const OTP_PURPOSE_VERIFY_SECONDARY_EMAIL = 'verify-secondary-email';

interface IOtpEmailVerificationContext {
  email: string;
}

/**
 * Service responsible for account management and settings.
 */
@Injectable()
export class AccountService {
  constructor(
    private userDao: UserDao,
    private configService: ConfigService<ConfigurationPath>,
    private userSettingsService: UserSettingsService,
    private mailService: MailService,
    private userOtpService: OtpService<IOtpEmailVerificationContext>,
  ) {}

  /**
   * Adds an email to the user account.
   * If the email already exist, we inform the user per email.
   * @param user
   * @param email
   * @throws FieldValidationException If the email is not valid.
   */
  async addEmail(user: User, email: string) {
    if (!isValidEmail(email)) {
      throw new FieldValidationException([{ property: 'email', errors: ['isEmail'] }]);
    }

    if (user.getUserEmail(email)) {
      return this.sendEmailAlreadyExistsMail(email);
    }

    /*
     * We add the unverified email even if it already exists on other users to prevent user enumeration attacks
     * Unverified emails will not be used in any way and can not be verified if they are verified on another account
     */
    await this.userDao.pushEmail(user, new UserEmail(email));

    const { otp, otpModel } = await this.createOrUpdateEmailVerificationOtp(user, email);
    await this.sendEmailVerificationMail(user, otp);
    return otpModel?.getOtpClientInfo();
  }

  private async createOrUpdateEmailVerificationOtp(user: User, email: string) {
    return this.userOtpService.createOrUpdateUserOtp(user, {
      purpose: OTP_PURPOSE_VERIFY_SECONDARY_EMAIL,
      context: { email },
    });
  }

  private async sendEmailAlreadyExistsMail(email: string) {
    // TODO: (i18n) missing translation
    const appName = escapeHTML(this.configService.get('appName') || '');
    return this.mailService.sendMail({
      to: email,
      subject: `Attempt to add an already existing email`,
      partials: {
        headline: 'Someone tried to add this email address to another account.',
        body: `<p>An attempt has been made to add this email address to another ${appName} account.
          In case you want to transfer this email to another account, please first remove this email address from the current account.
          Otherwise, just ignore this email.</p>`,
      },
    });
  }

  private async sendEmailVerificationMail(user: User, otp: string) {
    const appName = escapeHTML(this.configService.get('appName') || '');
    // TODO: (i18n) missing translation
    return this.mailService.sendMail({
      to: user.email,
      subject: 'Email verification',
      partials: {
        headline: 'Confirm your email address',
        body: `<p>Please enter the confirmation code below in the email verification form</p>
           <p>
             <div style="margin-left:50px;margin-right:50px;margin-bottom:30px">
               <div style="text-align:center;vertical-align:middle;font-size:30px">${otp}</div>
             </div>
           </p>
           <p>
             <small>If you did not add this email to your ${appName} account, please ignore this email.</small>
           </p>`,
      },
    });
  }

  async resendOtp(user: User, emailOrUsername: string): Promise<OtpInfo | null> {
    const email = isValidEmail(emailOrUsername) ? emailOrUsername : user.email;
    const { otp, otpModel } = await this.createOrUpdateEmailVerificationOtp(user, email);
    await this.sendEmailVerificationMail(user, otp);
    return otpModel?.getOtpClientInfo() || null;
  }

  async verifyEmail(user: User, verifyEmail: VerifyEmailDto) {
    const email = isValidEmail(verifyEmail.emailOrUsername)
      ? verifyEmail.emailOrUsername
      : user.email;

    if (!user.getUnverifiedUserEmail(email)) {
      // Should not happen...
      throw new FieldValidationException([{ property: 'email', errors: ['not_exist'] }]);
    }

    const { isValid } = await this.userOtpService.runValidation(
      user,
      OTP_PURPOSE_VERIFY_SECONDARY_EMAIL,
      verifyEmail.otp,
      { contextValidator: async (context) => context!.email === email },
    );

    if (!isValid) throw new InvalidOtpException();

    return this.userDao.setEmailVerification(user, email, true);
  }

  /**
   * Updates the avatar of the given user.
   * @param user The user
   */
  async updateAvatar(user: User) {
    const avatar = new Avatar(user.guid);
    await this.userDao.updateOneSetById(user, { avatar: new Avatar(user.guid) });
    return avatar;
  }

  /**
   * Updates the locale of the given user.
   * This function will throw a FieldValidationException in case the locale is not enabled or supported.
   * @param user The user
   * @param locale A valid and enabled locale.
   * @throws FieldValidationException If locale is not valid, supported or enabled.
   */
  async setLanguage(user: EntityIdentity<User>, locale: string): Promise<void> {
    locale = locale.toLowerCase();
    if (!getEnabledLocales().includes(locale)) {
      throw new FieldValidationException([{ property: 'locale', errors: ['invalid'] }]);
    }

    await this.userDao.updateOneSetById(user, { locale });
  }

  /**
   * Updates the timezone of the given user.
   * This function will throw a FieldValidationException in case the timezone is not valid.
   * @param user The user
   * @param timezone A valid timezone identifier.
   * @throws FieldValidationException If timezone is not valid.
   */
  async setTimezone(user: EntityIdentity<User>, timezone: string): Promise<void> {
    if (!getTimezones().includes(timezone)) {
      throw new FieldValidationException([{ property: 'timezone', errors: ['invalid'] }]);
    }
    await this.userDao.updateOneSetById(user, { timezone });
  }

  /**
   * Sets calendar preference settings of this user.
   * @param user
   * @param preferences
   */
  async setCalendarPreferences(
    user: User,
    preferences: CalendarPreferences,
  ): Promise<Record<string, any>> {
    const update: ISettingUpdate = [];

    const { weekStart, yearStart } = preferences;

    if (isDefined(weekStart)) {
      update.push({ key: USER_SETTING_CALENDAR_PREFERENCE_WEEKSTART, value: weekStart });
    }

    if (isDefined(yearStart)) {
      update.push({ key: USER_SETTING_CALENDAR_PREFERENCE_YEARSTART, value: yearStart });
    }

    await this.userSettingsService.updateSettings(user, update);
    return user.settings;
  }
}
