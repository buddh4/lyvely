import { User } from '@/users';
import { Profile } from '@/profiles';
import { BaseMembershipRole } from '@lyvely/common';

export interface InvitationIF {
  _id: TObjectId;
  id: string;
  createdBy: TObjectId;
  uid?: TObjectId;
  pid?: TObjectId;
  token?: string;
  role?: BaseMembershipRole.Member | BaseMembershipRole.Guest;
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
  invitee?: User;
  host: User;
  profile?: Profile;
}

export interface IMailInvitationContext extends InvitationContextIF<IMailInvitation> {
  token: string;
}

export interface IUserInvitationContext extends InvitationContextIF<IUserInvitation> {
  invitee: User;
  profile: Profile;
}
