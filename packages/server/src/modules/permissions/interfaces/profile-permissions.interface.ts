export enum BaseProfilePermissionRole {
  Owner = 'owner',
  Admin = 'admin',
  Moderator = 'moderator',
  Member = 'member',
  Guest = 'guest',
  Organization = 'organization',
  Follower = 'follower',
  User = 'user',
  Visitor = 'visitor'
}

/**
 * A role is assigned with a specific content visibility level, which defines the level of visible and accessible content
 * of a given role. A role can only view content which a visibility level >= the roles visibility level.
 */
export enum ContentVisibilityLevel {
  Owner,
  Admin,
  Moderator,
  Member,
  Guest, // External explicitely invited guests
  Organization,
  User, // Registered users
  Public, // Unregistered users
}

export type RoleName = string;
export type Permission = string;

export interface DefaultRolePermissions {
  [key: RoleName]: Permission
}

export interface ProfileRolePermission {
  permission: Permission
  role: RoleName,
}

export interface ProfileRoleDefinition {
  role: RoleName,
  extends?: string,
  visibility: ContentVisibilityLevel,
  label: string,
  assignable?: boolean,
  editable?: boolean,
  deletable?: boolean,
  extendable?: boolean
}

export const defaultProfileRolesDefinition: ProfileRoleDefinition[] = [
  { role: BaseProfilePermissionRole.Owner, label:'Owner', visibility: ContentVisibilityLevel.Owner },
  { role: BaseProfilePermissionRole.Admin, label:'Admin', visibility: ContentVisibilityLevel.Admin, assignable: true, extendable: true },
  { role: BaseProfilePermissionRole.Moderator, label:'Moderator', visibility: ContentVisibilityLevel.Moderator, assignable: true, extendable: true },
  { role: BaseProfilePermissionRole.Member, label: 'Member', visibility: ContentVisibilityLevel.Member, assignable: true, extendable: true,},
  { role: BaseProfilePermissionRole.Guest, label: 'Guest', visibility: ContentVisibilityLevel.Member, extendable: true },
  { role: BaseProfilePermissionRole.Organization, label: 'Guest', visibility: ContentVisibilityLevel.Organization },
  { role: BaseProfilePermissionRole.User, label: 'User', visibility: ContentVisibilityLevel.User },
  { role: BaseProfilePermissionRole.Visitor, label: 'Visitor', visibility: ContentVisibilityLevel.Public }
];