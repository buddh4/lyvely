import { UserStatus } from '@/users';

export interface IProfileRelationUserInfo {
  displayName: string;
  guid?: string;
  email?: string;
  description?: string;
}

export interface IProfileRelation<TID = string> {
  oid: TID;
  uid: TID;
  pid: TID;
  userInfo: IProfileRelationUserInfo;
  relationStatus: UserStatus;
  type: string;
  role?: string;
}
/**
 * A role is assigned with a specific visibility level, which defines the level of visible and accessible content
 * of a given role. A role can only view content which a visibility level >= the roles visibility level.
 */
export enum RoleVisibilityLevel {
  Owner,
  Admin,
  Moderator,
  Member,
  Guest, // External explicitly invited guests
  Organization,
  Follower,
  User, // Registered users
  Visitor, // Unregistered users
}
