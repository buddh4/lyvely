import { Injectable } from '@nestjs/common';
import { BaseProfilePermissionRole, ProfilePermissionsService, ProfilesService } from '@/profiles';
import { MailService } from '@/mails';
import {
  UserInvites,
  MailInvite,
  MaxInvitationError,
  BaseProfileRelationRole,
  ForbiddenServiceException,
} from '@lyvely/common';
import { User, UsersService } from '@/users';
import { JwtSignOptions } from '@nestjs/jwt/dist/interfaces';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { assureObjectId, ConfigurationPath } from '@/core';
import { UserInviteDao } from '@/user-invites/daos/user-invite.dao';
import { isDefined } from 'class-validator';
import { UserInvite } from '@/user-invites/schemas';

const JWT_USER_INVITE_TOKEN = 'user_invite_token';

@Injectable()
export class UserInvitesService {
  constructor(
    private profileService: ProfilesService,
    private userService: UsersService,
    private mailerService: MailService,
    private jwtService: JwtService,
    private configService: ConfigService<ConfigurationPath>,
    private inviteDao: UserInviteDao,
    private profilePermissionsService: ProfilePermissionsService,
  ) {}

  public async inviteUsers(host: User, inviteRequest: UserInvites) {
    await this.runUserCanInviteCheck(host, inviteRequest);
    // Check if user is already member
    // Load existing invites by given email
    const { invites } = inviteRequest;

    const emails = invites.map((invite) => invite.email);

    // Find existing users with verified emails
    // If non profile invite, filter out all existing users
    // If profile invite, filter out all already members
    // Create UserInvite for all users
    // Send existing user email for all existing users
    // Send platform invite email to all non existing users

    const userInvites = [] as UserInvite[];
    for (const invite of invites.invites) {
      userInvites.push(
        new UserInvite({
          pid: assureObjectId(invite.pid),
          createdBy: assureObjectId(host),
          email: invite.email,
        }),
      );
    }

    // Create new user-invite record with a token and pid = null record for each email
    // Send out user-invite email with link to registration form including the invite token
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
      expiresIn: '3h',
      algorithm: 'HS256',
    } as JwtSignOptions;

    const issuer = this.configService.get('auth.jwt.issuer');
    if (issuer) options.issuer = issuer;

    return this.jwtService.sign({ sub: invite.email, purpose: JWT_USER_INVITE_TOKEN }, options);
  }
}
