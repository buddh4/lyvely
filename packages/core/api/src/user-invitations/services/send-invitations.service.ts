import { Injectable } from '@nestjs/common';
import { Profile, ProfilesService } from '@/profiles';
import { isMultiUserProfile, InvitationRequest, MaxInvitationError } from '@lyvely/interface';

import { MailService } from '@/mails';
import {
  ForbiddenServiceException,
  isValidEmail,
  FieldValidationException,
  EntityNotFoundException,
} from '@lyvely/common';
import { User, UsersService } from '@/users';
import { JwtSignOptions } from '@nestjs/jwt/dist/interfaces';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { assureObjectId } from '@/core';
import { ConfigurationPath } from '@/config';
import { InvitationDao } from '../daos';
import { isDefined } from 'class-validator';
import { Invitation, MailInvitation, UserInvitation } from '../schemas';
import { NotificationService } from '@/notifications';
import { ProfileInvitationNotification } from '../notifications';
import { MultiUserSubscription } from '@/user-subscriptions';

const JWT_USER_INVITE_TOKEN = 'invitation_token';

@Injectable()
export class SendInvitationsService {
  constructor(
    private profileService: ProfilesService,
    private userService: UsersService,
    private mailService: MailService,
    private jwtService: JwtService,
    private configService: ConfigService<ConfigurationPath>,
    private inviteDao: InvitationDao,
    private notificationService: NotificationService,
  ) {}

  public async sendInvitations(host: User, inviteRequest: InvitationRequest) {
    await this.runUserCanInviteCheck(host, inviteRequest);
    const profile = inviteRequest.pid
      ? await this.profileService.findProfileById(inviteRequest.pid)
      : null;

    if (inviteRequest.pid && !profile)
      throw new EntityNotFoundException('Could not send profile invitation due to invalid pid.');

    return inviteRequest.pid
      ? await this.sendProfileInvites(host, inviteRequest, profile!)
      : await this.sendPlatformInvites(host, inviteRequest);
  }

  private async sendPlatformInvites(host: User, inviteRequest: InvitationRequest) {
    const userInvites = [] as MailInvitation[];
    const emails = inviteRequest.invites.map((invite) => invite.email.toLowerCase());
    const existingUsers = await this.userService.findUsersByVerifiedEmails(emails);

    for (const invite of inviteRequest.invites) {
      const email = invite.email.toLowerCase();
      // User can not self invite
      if (host.getUserEmail(email)) continue;
      // We do not allow inviting emails, which are already verified
      if (existingUsers.find((user) => user.getVerifiedUserEmail(email))) continue;

      userInvites.push(
        new MailInvitation({
          email,
          createdBy: assureObjectId(host),
          token: this.createMailInviteToken(invite.email),
        }),
      );
    }

    // TODO: assure we do not invite a user multiple times at least not by the same user

    const inviteModels = await this.inviteDao.saveMany(userInvites);
    return Promise.all(
      inviteModels.map((inviteModel) => {
        return this.sendInviteMail(
          (<MailInvitation>inviteModel).email,
          host,
          inviteModel.token!,
        ).then(() => inviteModel);
      }),
    );
  }

  private async sendProfileInvites(
    host: User,
    inviteRequest: InvitationRequest,
    profile?: Profile,
  ) {
    const { pid, invites } = inviteRequest;

    if (!profile || !pid) throw new EntityNotFoundException();
    if (!isMultiUserProfile(profile.type)) throw new ForbiddenServiceException();

    const emails = invites.map((invite) => invite.email);
    const existingUsers = await this.userService.findUsersByVerifiedEmails(emails);
    const existingMembers = await this.profileService.findProfileContextsByUsers(
      pid,
      existingUsers,
      true,
    );
    const invitationEntities: Invitation[] = [];

    for (const invite of invites) {
      const { email } = invite;

      if (!isValidEmail(email)) continue;
      // User can not invite himself
      if (host.getUserEmail(email)) continue;
      // Filter out all users which are already member of this profile
      if (existingMembers.find(({ user }) => user.getVerifiedUserEmail(email))) continue;

      const existingUser = existingUsers.find((user) => user.getVerifiedUserEmail(email));

      if (existingUser) {
        invitationEntities.push(
          new UserInvitation({
            pid,
            uid: existingUser._id,
            createdBy: assureObjectId(host),
            role: invite.role,
          }),
        );
      } else {
        invitationEntities.push(
          new MailInvitation({
            pid,
            email,
            createdBy: assureObjectId(host),
            role: invite.role,
            token: this.createMailInviteToken(invite.email),
          }),
        );
      }
    }

    const persistedInvitations = await this.inviteDao.saveMany(invitationEntities);

    const userInvitations = <UserInvitation[]>(
      persistedInvitations.filter((i) => i instanceof UserInvitation)
    );

    const mailInvitations = <MailInvitation[]>(
      persistedInvitations.filter((i) => i instanceof MailInvitation)
    );

    return Promise.all([
      this.sendMailInvitations(mailInvitations, host, profile),
      this.sendUserInvitations(userInvitations, host, profile),
    ]).then(() => [...userInvitations, ...mailInvitations]);
  }

  private async sendMailInvitations(invitations: MailInvitation[], host: User, profile?: Profile) {
    return Promise.all(
      invitations.map((inviteModel) =>
        this.sendInviteMail(inviteModel.email, host, inviteModel.token!, profile),
      ),
    );
  }

  private async sendUserInvitations(invitations: UserInvitation[], host: User, profile: Profile) {
    return this.notificationService.sendNotification(
      new ProfileInvitationNotification(profile, host),
      new MultiUserSubscription(invitations.map((i) => i.uid)),
    );
  }

  private async sendInviteMail(to: string, host: User, token: string, profile?: Profile) {
    if (!isValidEmail(to)) {
      throw new FieldValidationException([{ property: 'email', errors: ['validation.isEmail'] }]);
    }

    const appName = this.configService.get('appName');
    const inviteUrl = this.mailService.getEscapedAppUrl({
      path: '/mail-invitation',
      query: { t: token },
    });

    const subject = profile
      ? `${host.getDisplayName()} invited you to join ${profile.name}`
      : `${host.getDisplayName()} invited you to join ${appName}`;

    await this.mailService.sendMail({
      to,
      subject,
      partials: {
        headline: subject,
        body: `<div style="padding:20px 0">
                  <table cellspacing="0" cellpadding="0"> 
                    <tr> 
                      <td align="center" width="100" height="40" bgcolor="#047857" style="-webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; color: #ffffff; display: block;">
                        <a href="${inviteUrl}" target="_blank" style="font-size:16px; font-weight: bold; font-family:sans-serif; text-decoration: none; line-height:40px; width:100%; display:inline-block">
                        <span style="color: #ffffff;">
                            Join Now
                        </span>
                        </a>
                      </td> 
                    </tr> 
                  </table> 
                  <![endif]>
                </div>
                <p>This link is only valid for 1 day.</p>`,
      },
    });
  }

  private async runUserCanInviteCheck(host: User, inviteRequest: InvitationRequest) {
    if (inviteRequest.pid) return this.userCanInviteToProfile(host, inviteRequest);
    return this.userCanInviteUsers(host, inviteRequest);
  }

  private async userCanInviteUsers(host: User, inviteRequest: InvitationRequest) {
    const invites = inviteRequest.invites;
    const config = this.configService.get('invitations', {});
    if (isDefined(config.maxPerWeek)) {
      const invitesPerWeek = await this.inviteDao.countInvitesByUserThisWeek(host);
      if (invitesPerWeek + invites.length > config.maxPerWeek) {
        throw new MaxInvitationError(config.maxPerWeek - (invitesPerWeek + invites.length));
      }
    }
  }

  private async userCanInviteToProfile(host: User, inviteRequest: InvitationRequest) {
    const profileContext = await this.profileService.findProfileContext(host, inviteRequest.pid!);

    if (!profileContext.getMembership()) throw new ForbiddenServiceException();
    /*
    const permissions = ['invite.member'];
    if (inviteRequest.invites.find((invite) => invite.role === ProfileRelationRole.Guest)) {
      permissions.push('invite.guest');
    }

    // TODO: check for max users of profile

    if (
      !(await this.profilePermissionsService.checkEveryPermission(profileContext, ...permissions))
    ) {
      throw new ForbiddenServiceException();
    }
    */
  }

  public createMailInviteToken(email: string): string {
    const options = {
      secret: this.configService.get('auth.jwt.verify.secret'),
      expiresIn: '1d',
      algorithm: 'HS256',
    } as JwtSignOptions;

    const issuer = this.configService.get('auth.jwt.issuer');
    if (typeof issuer === 'string') options.issuer = issuer;

    return this.jwtService.sign({ sub: email, purpose: JWT_USER_INVITE_TOKEN }, options);
  }
}
