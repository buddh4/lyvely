import { Injectable } from '@nestjs/common';
import { Membership, Profile, ProfileMembershipService, ProfilesService } from '@/profiles';
import { User } from '@/users';
import { InvitationDao } from '../daos';
import { MailInvitation, UserInvitation } from '../schemas';
import { MailInvitationService } from './mail-invitations.service';
import { IMailInvitationContext, InvitationIF } from '../interfaces';
import { UserInvitationsService } from './user-invitations.service';
import { assureObjectId, DocumentIdentity } from '@/core';
import { DocumentNotFoundException } from '@lyvely/interface';

@Injectable()
export class InvitationsService {
  constructor(
    private profileService: ProfilesService,
    private membershipService: ProfileMembershipService,
    private inviteDao: InvitationDao,
    private mailInvitationsService: MailInvitationService,
    private userInvitationsService: UserInvitationsService,
  ) {}

  public async getMailInvitationContext(token: string) {
    return this.mailInvitationsService.getInvitationContext(token);
  }

  public async getUserInvitationContext(user: User, profile: DocumentIdentity<Profile>) {
    return this.userInvitationsService.getInvitationContext({ user, profile });
  }

  public async validateMailInvitationContext(metaData: IMailInvitationContext) {
    return this.mailInvitationsService.validateInvitationContext(metaData);
  }

  public async acceptUserInvitation(
    user: User,
    profile: DocumentIdentity<Profile>,
  ): Promise<Membership | undefined> {
    // TODO: invalidate notification
    const invitation = await this.userInvitationsService.getInvitation({ user, profile });
    if (!invitation) throw new DocumentNotFoundException();
    return this.acceptInvitation(user, invitation);
  }

  public async declineUserInvitation(
    user: User,
    profile: DocumentIdentity<Profile>,
  ): Promise<number> {
    // TODO: invalidate notification
    return this.inviteDao.deleteMany({ uid: assureObjectId(user), pid: assureObjectId(profile) });
  }

  public async acceptMailInvitation(user: User, token: string): Promise<Membership | undefined> {
    const invitation = await this.mailInvitationsService.getInvitation(token);
    if (!invitation) throw new DocumentNotFoundException();
    return this.acceptInvitation(user, invitation);
  }

  public async acceptInvitation(user: User, invitation: InvitationIF) {
    return Promise.all([
      this.handleProfileInvitation(user, invitation),
      this.inviteDao.updateOneSetById(invitation._id, { uid: user._id, email: null, token: null }),
      this.invalidateOtherInvitations(invitation),
    ]).then((result) => result[0]);
  }

  private async handleProfileInvitation(user: User, invitation: InvitationIF) {
    if (!invitation.pid) return;
    const profile = await this.profileService.findProfileById(invitation.pid);
    if (!profile) throw new DocumentNotFoundException();
    return this.membershipService.createMembership(profile, user, invitation.role);
  }

  private async invalidateOtherInvitations(invitation: InvitationIF) {
    if (invitation instanceof MailInvitation) {
      return this.mailInvitationsService.invalidateOtherInvitations(invitation);
    } else if (invitation instanceof UserInvitation) {
      return this.userInvitationsService.invalidateOtherInvitations(invitation);
    }
  }
}
