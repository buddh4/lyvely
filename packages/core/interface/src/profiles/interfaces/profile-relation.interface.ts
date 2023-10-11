export interface IProfileRelationUserInfo {
  displayName: string;
  guid?: string;
  email?: string;
  description?: string;
}

export interface IProfileRelation {
  oid: any;
  uid: any;
  pid: any;
  userInfo: IProfileRelationUserInfo;
  type: string;
  role?: string;
}

export interface IMembership extends IProfileRelation {
  role: string;
}

/**
 * A role is assigned with a specific content visibility level, which defines the level of visible and accessible content
 * of a given role. A role can only view content which a visibility level >= the roles visibility level.
 */
export enum RoleVisibilityLevel {
  Owner,
  Admin,
  Moderator,
  Member,
  Guest, // External explicitly invited guests
  Organization,
  User, // Registered users
  Visitor, // Unregistered users
}
