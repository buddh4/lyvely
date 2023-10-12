import { OptionalUser, User } from '@/users';
import { BaseMembershipRole } from '@lyvely/core-interface';
import { Types } from 'mongoose';
import { Profile } from '@/profiles';

export interface InvitationIF {
  _id: Types.ObjectId;
  id: string;
  createdBy: Types.ObjectId;
  uid?: Types.ObjectId;
  pid?: Types.ObjectId;
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
  uid: Types.ObjectId;
  pid: Types.ObjectId;
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
