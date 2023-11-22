import { OptionalUser, User } from '@/users';
import { ProfileMembershipRole } from '@lyvely/interface';
import { Profile } from '@/profiles';
import { TObjectId } from '@/core';

export interface InvitationIF {
  _id: TObjectId;
  id: string;
  createdBy: TObjectId;
  uid?: TObjectId;
  pid?: TObjectId;
  token?: string;
  role?: ProfileMembershipRole.Member | ProfileMembershipRole.Guest;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMailInvitation extends InvitationIF {
  email: string;
}

export interface IUserInvitation extends InvitationIF {
  uid: TObjectId;
  pid: TObjectId;
}

export interface InvitationContextIF<TInvitation extends InvitationIF = InvitationIF> {
  invitation: TInvitation;
  invitee: OptionalUser;
  host: User;
  profile?: Profile | null;
}

export interface IMailInvitationContext extends InvitationContextIF<IMailInvitation> {
  token: string;
}

export interface IUserInvitationContext extends InvitationContextIF<IUserInvitation> {
  invitee: User;
  profile: Profile;
}
