import { User } from '@lyvely/users';
import { Profile, BaseMembershipRole } from '@lyvely/profiles';
import { Types } from 'mongoose';

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
  invitee?: User | null;
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
