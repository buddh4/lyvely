import { ContentVisibilityLevel, BaseProfileRelationRole } from '@lyvely/common';

export enum BaseMembershipRole {
  Owner = 'owner',
  Member = 'member',
  Admin = 'admin',
}

export enum BaseProfilePermissionRole {
  Owner = 'owner',
  Admin = 'admin',
  Moderator = 'moderator',
  Member = 'member',
  Guest = 'guest',
  Organization = 'organization',
  InvitedMember = 'member_invited',
  RequestedMember = 'member_requested',
  Follower = 'follower',
  User = 'user',
  Visitor = 'visitor'
}

export type RoleName = string;
export type Permission = string;

export interface IDefaultRolePermissions {
  [key: RoleName]: Permission
}

export interface IProfileRolePermission {
  permission: Permission
  role: RoleName,
}

export interface IProfileRoleDefinition {
  role: RoleName,
  extends?: string,
  visibility: ContentVisibilityLevel,
  label: string,
  assignable?: boolean,
  editable?: boolean,
  deletable?: boolean,
  extendable?: boolean
}

export const defaultProfileRolesDefinition: IProfileRoleDefinition[] = [
  { role: BaseProfileRelationRole.Owner, label:'Owner', visibility: ContentVisibilityLevel.Owner },
  { role: BaseProfileRelationRole.Admin, label:'Admin', visibility: ContentVisibilityLevel.Admin, assignable: true, extendable: true },
  { role: BaseProfileRelationRole.Moderator, label:'Moderator', visibility: ContentVisibilityLevel.Moderator, assignable: true, extendable: true },
  { role: BaseProfileRelationRole.Member, label: 'Member', visibility: ContentVisibilityLevel.Member, assignable: true, extendable: true },
  { role: BaseProfileRelationRole.Guest, label: 'Guest', visibility: ContentVisibilityLevel.Member, extendable: true },
  { role: BaseProfileRelationRole.Organization, label: 'Guest', visibility: ContentVisibilityLevel.Organization },
  { role: BaseProfileRelationRole.InvitedMember, label: 'Invited users', visibility: ContentVisibilityLevel.User },
  { role: BaseProfileRelationRole.RequestedMember, label: 'Membership requested', visibility: ContentVisibilityLevel.User },
  { role: BaseProfileRelationRole.User, label: 'User', visibility: ContentVisibilityLevel.User },
  { role: BaseProfileRelationRole.Visitor, label: 'Visitor', visibility: ContentVisibilityLevel.Public }
];
