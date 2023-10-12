import { Injectable } from '@nestjs/common';
import { assureStringId, ConfigurationPath } from '@/core';
import { MailInvitation } from '../schemas';
import { MailInvitationInfo } from '@lyvely/core-interface';
import { IMailInvitationContext } from '../interfaces';
import { OptionalUser, UsersService } from '@/users';
import { Profile, ProfilesService } from '@/profiles';
import jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { MailInvitationDao } from '../daos';
import { AbstractInvitationsService } from './abstract-invitations.service';

export type InvitationToken = string;

@Injectable()
export class MailInvitationService extends AbstractInvitationsService<
  MailInvitation,
  IMailInvitationContext,
  MailInvitationInfo,
  InvitationToken
> {
  constructor(
    private configService: ConfigService<ConfigurationPath>,
    private mailInvitationDao: MailInvitationDao,
    private userService: UsersService,
    private profileService: ProfilesService,
  ) {
    super();
  }

  async getInvitationContext(token: InvitationToken): Promise<IMailInvitationContext | null> {
    if (!token) return null;

    const invitation = await this.getInvitation(token);

    if (!invitation) return null;

    const [invitee, host, profile]: [OptionalUser, OptionalUser, Profile | null] =
      await Promise.all([
        this.userService.findByVerifiedEmail(invitation.email),
        this.userService.findUserById(invitation.createdBy),
        this.profileService.findProfileById(invitation.pid),
      ]);

    if (!host) return null;

    return { invitee, host, profile, token, invitation };
  }

  async getInvitation(token: InvitationToken): Promise<MailInvitation | null> {
    return this.mailInvitationDao.findByToken(token);
  }

  protected createInfoModel(context: IMailInvitationContext): MailInvitationInfo {
    const { invitee, host, profile, invitation } = context;

    return new MailInvitationInfo({
      email: invitation.email,
      pid: assureStringId(profile, true),
      profileName: profile?.name,
      profileGuid: profile?.guid,
      isVerifiedMail: !!invitee,
      hostName: host?.getDisplayName(),
      hostGuid: host?.guid,
      hostId: host?.id,
    });
  }

  async validateInvitationContext(metaData: IMailInvitationContext): Promise<boolean> {
    return (
      (await super.validateInvitationContext(metaData)) && (await this.verifyToken(metaData.token))
    );
  }

  private verifyToken(token: string): Promise<boolean> {
    if (!token) return Promise.resolve(false);
    return new Promise((resolve) => {
      jwt.verify(token, this.configService.get('auth.jwt.verify.secret')!, (err, decoded) => {
        resolve(!err);
      });
    });
  }

  async invalidateOtherInvitations(invitation: MailInvitation) {
    return this.mailInvitationDao.deleteMany({
      _id: { $ne: invitation._id },
      email: invitation.email,
      pid: invitation.pid,
    });
  }
}
