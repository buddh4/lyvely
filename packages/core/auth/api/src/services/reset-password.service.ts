import { Injectable } from '@nestjs/common';
import { FieldValidationException, isValidEmail, escapeHTML } from '@lyvely/common';
import { UserStatus, User, UsersService } from '@lyvely/users';
import { MailService } from '@lyvely/mails';
import { ConfigService } from '@nestjs/config';
import { ConfigurationPath, UrlGenerator } from '@lyvely/core';
import { JwtService } from '@nestjs/jwt';
import { JwtSignOptions } from '@nestjs/jwt/dist/interfaces';
import { JWT_RESET_PASSWORD_TOKEN } from '../guards';

@Injectable()
export class ResetPasswordService {
  constructor(
    private userService: UsersService,
    private mailService: MailService,
    private jwtService: JwtService,
    private configService: ConfigService<ConfigurationPath>,
    private urlGenerator: UrlGenerator,
  ) {}

  async sendMail(email: string) {
    if (!isValidEmail(email)) {
      throw new FieldValidationException([{ property: 'email', errors: ['validation.isEmail'] }]);
    }

    const user = await this.userService.findUserByMainEmail(email);
    if (!user || user.status === UserStatus.Disabled) {
      // Do not throw any error due to enumeration attacks
      return;
    }

    const appName = this.configService.get('appName');
    const forgotPasswordUrl = escapeHTML(
      encodeURI(this.urlGenerator.getAppUrl({ path: '/reset-password' }).href),
    );
    const token = this.createResetPasswordToken(user);
    const resetUrl = this.urlGenerator.getAppUrl({ path: '/reset-password/', query: { t: token } });

    await this.mailService.sendMail({
      to: email,
      subject: `Attempt to register an already existing email`,
      partials: {
        headline: appName + ' password reset',
        body: `<p>A password reset was requested for your ${appName} account. In order to reset your password, please
                the following button.</p>
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
                        Reset your password     
                    </span>
                    </a>
                  </td> 
                  </tr> </table> 
                  <![endif]>
                </div>
                <p>This link is only valid for 3 hours. To get a new password reset link, visit 
                <a class="link" href="${forgotPasswordUrl}" target="_blank">${forgotPasswordUrl}</a>
                </p>`,
      },
    });
  }

  public createResetPasswordToken(user: User): string {
    const options = {
      secret: this.configService.get('auth.jwt.verify.secret'),
      expiresIn: '3h',
      algorithm: 'HS256',
    } as JwtSignOptions;

    const issuer = this.configService.get('auth.jwt.issuer');
    if (issuer) options.issuer = issuer;

    return this.jwtService.sign(
      { sub: user._id.toString(), purpose: JWT_RESET_PASSWORD_TOKEN },
      options,
    );
  }

  async resetPassword(user: User, password: string) {
    return this.userService.setUserPassword(user, password, true);
  }
}
