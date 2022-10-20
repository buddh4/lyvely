import { Injectable } from '@nestjs/common';
import { User, UserDao, UserEmail } from '@/users';
import { escapeHTML, FieldValidationException, VerifyEmailDto, isValidEmail } from '@lyvely/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationPath } from '@/core';
import { MailService } from '@/mails';
import { UserOtpService } from '@/auth/services/user-otp.service';

const OTP_PURPOSE_VERIFY_SECONDARY_EMAIL = 'verify-secondary-email';

interface OtpEmailVerificationContext {
  email: string;
}

@Injectable()
export class AccountService {
  constructor(
    private userDao: UserDao,
    private configService: ConfigService<ConfigurationPath>,
    private mailService: MailService,
    private userOtpService: UserOtpService<OtpEmailVerificationContext>,
  ) {}

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

    const otp = await this.createOrUpdateEmailVerificationOtp(user, email);
    return this.sendEmailVerificationMail(user, otp);
  }

  private async createOrUpdateEmailVerificationOtp(user: User, email: string) {
    const { otp } = await this.userOtpService.createOrUpdateUserOtp(user, {
      purpose: OTP_PURPOSE_VERIFY_SECONDARY_EMAIL,
      context: { email },
    });

    return otp;
  }

  private async sendEmailAlreadyExistsMail(email: string) {
    // TODO: (i18n) missing translation
    const appName = escapeHTML(this.configService.get('appName'));
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
    const appName = escapeHTML(this.configService.get('appName'));
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

  async verifyEmail(user: User, verifyEmail: VerifyEmailDto) {
    if (!user.getUnverifiedUserEmail(verifyEmail.email)) {
      // Should not happen...
      throw new FieldValidationException([{ property: 'email', errors: ['Invalid email'] }]);
    }

    const { isValid } = await this.userOtpService.runValidation(
      user,
      OTP_PURPOSE_VERIFY_SECONDARY_EMAIL,
      verifyEmail.otp,
      { contextValidator: async (context) => context.email === verifyEmail.email },
    );

    if (!isValid) throw new FieldValidationException([{ property: 'otp', errors: ['auth.otp.errors.attempts'] }]);

    await this.userDao.setEmailVerification(user, verifyEmail);
  }
}
