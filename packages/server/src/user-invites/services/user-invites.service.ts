import { Injectable } from '@nestjs/common';
import { Profile, ProfilePermissionsService, ProfilesService } from '@/profiles';
import { MailService } from '@/mails';
import {
  UserInvites,
  MailInvite,
  MaxInvitationError,
  BaseProfileRelationRole,
  ForbiddenServiceException,
  isValidEmail,
  FieldValidationException,
  UserStatus,
  escapeHTML,
  isMultiUserProfile,
} from '@lyvely/common';
import { User, UsersService } from '@/users';
import { JwtSignOptions } from '@nestjs/jwt/dist/interfaces';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { assureObjectId, ConfigurationPath, UrlGenerator } from '@/core';
import { UserInviteDao } from '@/user-invites/daos/user-invite.dao';
import { isDefined } from 'class-validator';
import { UserInvite } from '@/user-invites/schemas';

const JWT_USER_INVITE_TOKEN = 'user_invite_token';

@Injectable()
export class UserInvitesService {
  constructor(
    private profileService: ProfilesService,
    private userService: UsersService,
    private mailService: MailService,
    private jwtService: JwtService,
    private configService: ConfigService<ConfigurationPath>,
    private inviteDao: UserInviteDao,
    private profilePermissionsService: ProfilePermissionsService,
  ) {}

  public async inviteUsers(host: User, inviteRequest: UserInvites) {
    await this.runUserCanInviteCheck(host, inviteRequest);
    // Check if user is already member
    // Load existing invites by given email
    const { invites, pid } = inviteRequest;

    const profile = pid ? await this.profileService.findProfileById(pid) : null;

    if (pid && !isMultiUserProfile(profile.type)) throw new ForbiddenServiceException();
    // TODO:
    // Find existing users with verified emails
    // If non profile invite, filter out all existing users
    // If profile invite, filter out all already members
    // Create UserInvite for all users
    // Send existing user email for all existing users
    // Send platform invite email to all non existing users

    const userInvites = [] as UserInvite[];
    for (const invite of invites) {
      userInvites.push(
        new UserInvite({
          pid: inviteRequest.pid ? assureObjectId(inviteRequest.pid) : undefined,
          createdBy: assureObjectId(host),
          email: invite.email,
          role: !inviteRequest.pid
            ? undefined
            : invite.role === BaseProfileRelationRole.Guest
            ? BaseProfileRelationRole.Guest
            : BaseProfileRelationRole.Member,
          token: this.createUserInviteToken(invite),
        }),
      );
    }

    const inviteModels = await this.inviteDao.saveMany(userInvites);
    return Promise.all(
      inviteModels.map((inviteModel) => {
        return this.sendInviteMail(inviteModel.email, host, inviteModel.token, profile).then(
          () => inviteModel,
        );
      }),
    );
  }

  private async sendInviteMail(to: string, host: User, token: string, profile?: Profile) {
    if (!isValidEmail(to)) {
      throw new FieldValidationException([{ property: 'email', errors: ['validation.isEmail'] }]);
    }

    const appName = this.configService.get('appName');
    const inviteUrl = this.mailService.getEscapedAppUrl({
      path: '/user-invitation',
      query: { t: token },
    });

    const subject = profile
      ? `${host.getDisplayName()} invited you to join ${profile.name}`
      : `${host.getDisplayName()} invited you to join ${appName}`;

    await this.mailService.sendMail({
      to,
      subject,
      partials: {
        headline: appName + ' invitation',
        body: `<p>${subject}</p>
                <div style="padding:20px 0">
                  <table cellspacing="0" cellpadding="0" align="center"> <tr> 
                  <td align="center" width="300" height="40" bgcolor="#047857" style="-webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; color: #ffffff; display: block;">
                    <a href="${inviteUrl}" target="_blank" style="font-size:16px; font-weight: bold; font-family:sans-serif; text-decoration: none; line-height:40px; width:100%; display:inline-block">
                    <span style="color: #ffffff;">
                        Join Now
                    </span>
                    </a>
                  </td> 
                  </tr> </table> 
                  <![endif]>
                </div>
                <p>This link is only valid for 1 day.</p>`,
      },
    });
  }

  private async runUserCanInviteCheck(host: User, inviteRequest: UserInvites) {
    if (inviteRequest.pid) return this.userCanInviteToProfile(host, inviteRequest);
    return this.userCanInviteUsers(host, inviteRequest);
  }

  private async userCanInviteUsers(host: User, inviteRequest: UserInvites) {
    const invites = inviteRequest.invites;
    const config = this.configService.get('user-invites', {});
    if (isDefined(config.maxPerWeek)) {
      const invitesPerWeek = await this.inviteDao.countInvitesByUserThisWeek(host);
      if (invitesPerWeek + invites.length > config.maxPerWeek) {
        throw new MaxInvitationError(config.maxPerWeek - (invitesPerWeek + invites.length));
      }
    }
  }

  async userCanInviteToProfile(host: User, inviteRequest: UserInvites) {
    const profileContext = await this.profileService.findUserProfileRelations(
      host,
      inviteRequest.pid,
    );

    const permissions = ['invite.member'];
    if (inviteRequest.invites.find((invite) => invite.role === BaseProfileRelationRole.Guest)) {
      permissions.push('invite.guest');
    }

    // TODO: check for max users of profile

    if (
      !(await this.profilePermissionsService.checkEveryPermission(profileContext, ...permissions))
    ) {
      throw new ForbiddenServiceException();
    }
  }

  public createUserInviteToken(invite: MailInvite): string {
    const options = {
      secret: this.configService.get('auth.jwt.verify.secret'),
      expiresIn: '1d',
      algorithm: 'HS256',
    } as JwtSignOptions;

    const issuer = this.configService.get('auth.jwt.issuer');
    if (issuer) options.issuer = issuer;

    return this.jwtService.sign({ sub: invite.email, purpose: JWT_USER_INVITE_TOKEN }, options);
  }
}
