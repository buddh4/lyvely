import { Injectable } from '@nestjs/common';
import { Profile, ProfilePermissionsService, ProfilesService } from '@/profiles';
import { MailService } from '@/mails';
import { UserStatus } from '@lyvely/common';
import { User, UsersService } from '@/users';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { assureObjectId, ConfigurationPath } from '@/core';
import { InvitationDao } from '@/invitations/daos/invitation.dao';
import jwt from 'jsonwebtoken';
import { Invitation, MailInvitation, UserInvitation } from '@/invitations/schemas';

const JWT_USER_INVITE_TOKEN = 'invitation_token';

export interface IInvitationContext {
  invitation: Invitation;
  invitee?: User;
  host?: User;
  profile?: Profile;
  token: string;
}

@Injectable()
export class InvitationsService {
  constructor(
    private profileService: ProfilesService,
    private userService: UsersService,
    private mailService: MailService,
    private jwtService: JwtService,
    private configService: ConfigService<ConfigurationPath>,
    private inviteDao: InvitationDao,
    private profilePermissionsService: ProfilePermissionsService,
  ) {}

  public async acceptInvitation(user: User, invitation: Invitation) {
    return Promise.all([
      this.inviteDao.updateOneSetById(invitation, { uid: user._id, email: null, token: null }),
      this.invalidateOtherInvitations(invitation),
    ]);
  }

  public async invalidateOtherInvitations(invitation: Invitation) {
    if (invitation instanceof MailInvitation) {
      return this.inviteDao.deleteMany({
        _id: { $ne: assureObjectId(invitation) },
        email: invitation.email,
        pid: invitation.pid,
      });
    } else if (invitation.pid) {
      return this.inviteDao.deleteMany({
        _id: { $ne: assureObjectId(invitation) },
        uid: invitation.uid,
        pid: invitation.pid,
      });
    }
  }

  public async getInvitationMetadata(token: string): Promise<IInvitationContext> {
    if (!token) return null;

    const invitation = await this.inviteDao.findOne({ token });

    if (!invitation) return null;

    const inviteePromise =
      invitation instanceof MailInvitation
        ? this.userService.findByVerifiedEmail(invitation.email)
        : invitation instanceof UserInvitation
        ? this.userService.findUserById(invitation.uid)
        : undefined;

    const profilePromise = invitation.pid
      ? this.profileService.findProfileById(invitation.pid)
      : undefined;
    const hostPromise = this.userService.findUserById(invitation.createdBy);

    const [invitee, host, profile]: [User, User, Profile] = await Promise.all([
      inviteePromise,
      hostPromise,
      profilePromise,
    ]);

    return { invitee, host, profile, token, invitation };
  }

  public async validateInvitationMetadata(metaData: IInvitationContext): Promise<boolean> {
    if (!metaData) return false;
    const { invitee, host, profile, token, invitation } = metaData;
    return (
      host.status === UserStatus.Active &&
      (!invitation.pid || profile) &&
      (await this.verifyToken(token))
    );
  }

  public verifyToken(token: string): Promise<boolean> {
    if (!token) return Promise.resolve(false);
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.configService.get('auth.jwt.verify.secret'), (err, decoded) => {
        resolve(!err);
      });
    });
  }
}
