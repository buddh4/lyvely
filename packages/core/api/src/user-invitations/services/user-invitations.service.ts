import { Injectable } from '@nestjs/common';
import { assureStringId, DocumentIdentity } from '@/core';
import { UserInvitation } from '../schemas';
import { UserInvitationInfo } from '@lyvely/interface';
import { OptionalUser, User, UsersService } from '@/users';
import { Profile, ProfilesService } from '@/profiles';
import { IUserInvitationContext } from '../interfaces';
import { UserInvitationDao } from '../daos';
import { AbstractInvitationsService } from './abstract-invitations.service';

export type UserInvitationSearch = {
  profile: DocumentIdentity<Profile>;
  user: User;
};

@Injectable()
export class UserInvitationsService extends AbstractInvitationsService<
  UserInvitation,
  IUserInvitationContext,
  UserInvitationInfo,
  UserInvitationSearch
> {
  constructor(
    private profilesService: ProfilesService,
    private userInvitationDao: UserInvitationDao,
    private usersService: UsersService
  ) {
    super();
  }

  async getInvitationContext(search: UserInvitationSearch): Promise<IUserInvitationContext | null> {
    const { user: invitee, profile: profileIdentity } = search;

    if (!invitee || !profileIdentity) return null;

    const invitation = await this.getInvitation(search);

    if (!invitation) return null;

    const [host, profile]: [OptionalUser, Profile | null] = await Promise.all([
      this.usersService.findUserById(invitation.createdBy),
      this.profilesService.findProfileById(invitation.pid),
    ]);

    if (!host || !profile) return null;

    return { invitee, host, profile, invitation };
  }

  async getInvitation(search: UserInvitationSearch): Promise<UserInvitation | null> {
    const { user, profile } = search;
    return this.userInvitationDao.findByProfileAndInvitee(profile, user);
  }

  protected createInfoModel(context: IUserInvitationContext): UserInvitationInfo {
    const { host, profile } = context;

    return new UserInvitationInfo({
      pid: assureStringId(profile),
      profileName: profile.name,
      profileGuid: profile.guid,
      hostName: host?.getDisplayName(),
      hostGuid: host?.guid,
      hostId: host?.id,
    });
  }

  async invalidateOtherInvitations(invitation: UserInvitation) {
    return this.userInvitationDao.deleteMany({
      _id: { $ne: invitation._id },
      uid: invitation.uid,
      pid: invitation.pid,
    });
  }
}
