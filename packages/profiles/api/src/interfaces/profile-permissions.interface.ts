import { BaseProfileRelationRole, RoleVisibilityLevel } from '@lyvely/profiles-interface';

export type RoleName = string;
export type Permission = string;

export interface IDefaultRolePermissions {
  [key: RoleName]: Permission;
}

export interface IProfileRolePermission {
  permission: Permission;
  role: RoleName;
}

export interface IProfileRoleDefinition {
  role: RoleName;
  extends?: string;
  visibility: RoleVisibilityLevel;
  label: string;
  assignable?: boolean;
  editable?: boolean;
  deletable?: boolean;
  extendable?: boolean;
}

export const defaultProfileRolesDefinition: IProfileRoleDefinition[] = [
  { role: BaseProfileRelationRole.Owner, label: 'Owner', visibility: RoleVisibilityLevel.Owner },
  {
    role: BaseProfileRelationRole.Admin,
    label: 'Admin',
    visibility: RoleVisibilityLevel.Admin,
    assignable: true,
    extendable: true,
  },
  {
    role: BaseProfileRelationRole.Moderator,
    label: 'Moderator',
    visibility: RoleVisibilityLevel.Moderator,
    assignable: true,
    extendable: true,
  },
  {
    role: BaseProfileRelationRole.Member,
    label: 'Member',
    visibility: RoleVisibilityLevel.Member,
    assignable: true,
    extendable: true,
  },
  {
    role: BaseProfileRelationRole.Guest,
    label: 'Guest',
    visibility: RoleVisibilityLevel.Member,
    extendable: true,
  },
  {
    role: BaseProfileRelationRole.Organization,
    label: 'Guest',
    visibility: RoleVisibilityLevel.Organization,
  },
  {
    role: BaseProfileRelationRole.InvitedMember,
    label: 'Invited users',
    visibility: RoleVisibilityLevel.User,
  },
  {
    role: BaseProfileRelationRole.RequestedMember,
    label: 'Membership requested',
    visibility: RoleVisibilityLevel.User,
  },
  { role: BaseProfileRelationRole.User, label: 'User', visibility: RoleVisibilityLevel.User },
  {
    role: BaseProfileRelationRole.Visitor,
    label: 'Visitor',
    visibility: RoleVisibilityLevel.Public,
  },
];
