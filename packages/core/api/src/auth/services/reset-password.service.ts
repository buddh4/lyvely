import { Injectable, Logger } from '@nestjs/common';
import { escapeHTML } from '@lyvely/common';
import { User, UsersService } from '@/users';
import { UserStatus } from '@lyvely/interface';
import { MailService } from '@/mails';
import { type AuthModuleConfig, UrlGenerator } from '@/core';
import { JwtService } from '@nestjs/jwt';
import { JwtSignOptions } from '@nestjs/jwt/dist/interfaces';
import { JWT_RESET_PASSWORD_TOKEN } from '../guards';
import { I18n } from '@/i18n';
import { LyvelyConfigService } from '@/config';

@Injectable()
export class ResetPasswordService {
  private logger = new Logger(ResetPasswordService.name);

  constructor(
    private userService: UsersService,
    private mailService: MailService,
    private jwtService: JwtService,
    private i18n: I18n,
    private configService: LyvelyConfigService<AuthModuleConfig>,
    private urlGenerator: UrlGenerator
  ) {}

  async sendMail(usernameOrEmail: string) {
    const user = await this.userService.findUserByUsernameOrMainEmail(usernameOrEmail);
    if (!user || user.status === UserStatus.Disabled) {
      // Do not throw any error due to enumeration attacks
      this.logger.error('Reset password called with wrong username or email');
      return;
    }

    const appName = escapeHTML(this.configService.get('appName')!);
    const forgotPasswordUrl = escapeHTML(
      encodeURI(this.urlGenerator.getAppUrl({ path: '/reset-password' }).href)
    );
    const token = this.createResetPasswordToken(user);
    const resetUrl = this.urlGenerator.getAppUrl({ path: '/reset-password/', query: { t: token } });

    const i18n = this.i18n.translation('auth', user);

    await this.mailService.sendMail({
      to: usernameOrEmail,
      subject: i18n.t('reset-password.subject'),
      partials: {
        headline: i18n.t('reset-password.headline'),
        body: `
          <p>${i18n.t('reset-password.guide', { appName })}</p>
            <div style="padding:20px 0">
            <!--[if mso]>
              <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${resetUrl}" style="height:40px;v-text-anchor:middle;width:300px;" arcsize="10%" stroke="f" fillcolor="#d62828">
                <w:anchorlock/>
                <center style="color:#ffffff;font-family:sans-serif;font-size:16px;font-weight:bold;">
                   Reset your password    
                </center>
              </v:roundrect>
              <![endif]-->
              <![if !mso]>
              <table cellspacing="0" cellpadding="0" align="center"> <tr> 
              <td align="center" width="300" height="40" bgcolor="#047857" style="-webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; color: #ffffff; display: block;">
                <a href="${resetUrl}" target="_blank" style="font-size:16px; font-weight: bold; font-family:sans-serif; text-decoration: none; line-height:40px; width:100%; display:inline-block">
                <span style="color: #ffffff;">
                    ${i18n.t('reset-password.link')}    
                </span>
                </a>
              </td> 
              </tr> </table> 
              <![endif]>
            </div>
            <p>
              ${i18n.t('reset-password.info', {
                link: `<a class="link" href="${forgotPasswordUrl}" target="_blank">${forgotPasswordUrl}</a>`,
              })}
            </p>
        `,
      },
    });
  }

  public createResetPasswordToken(user: User): string {
    const options = {
      secret: this.configService.getModuleConfigOrThrow('auth', 'jwt.verify.secret'),
      expiresIn: '3h',
      algorithm: 'HS256',
    } as JwtSignOptions;

    const issuer = this.configService.getModuleConfigOrThrow('auth', 'jwt.issuer');
    if (issuer) options.issuer = issuer;

    return this.jwtService.sign(
      { sub: user._id.toString(), purpose: JWT_RESET_PASSWORD_TOKEN },
      options
    );
  }

  async resetPassword(user: User, password: string) {
    return this.userService.setUserPassword(user, password, true);
  }
}
