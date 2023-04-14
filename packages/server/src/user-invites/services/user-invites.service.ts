import { Injectable } from '@nestjs/common';
import { ProfilesService } from '@/profiles';
import { MailService } from '@/mails';
import { UserInvites, MailInvite, MaxInvitationError } from '@lyvely/common';
import { User } from '@/users';
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
    private mailerService: MailService,
    private jwtService: JwtService,
    private configService: ConfigService<ConfigurationPath>,
    private inviteDao: UserInviteDao,
  ) {}

  public async inviteUsers(host: User, invites: UserInvites) {
    const config = this.configService.get('user-invites', 20);
    const maxPerWeek: number = config.maxPerWeek || 30;
    if (isDefined(maxPerWeek)) {
      const invitesPerWeek = await this.inviteDao.countInvitesByUserThisWeek(host);
      if (invitesPerWeek + invites.invites.length > maxPerWeek) {
        throw new MaxInvitationError(maxPerWeek - (invitesPerWeek + invites.invites.length));
      }
    }

    // Check if user is already member
    // Load existing invites by given email

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
