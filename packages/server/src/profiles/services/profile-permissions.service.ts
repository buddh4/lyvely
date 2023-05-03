import { Inject, Injectable, Optional } from '@nestjs/common';
import { ProfileContext } from '../models';
import { minimatch } from 'minimatch';
import { BaseMembershipRole } from '@lyvely/common';
import {
  defaultProfileRolesDefinition,
  IDefaultRolePermissions,
  IProfileRoleDefinition,
  IProfileRolePermission,
} from '../interfaces';
import { PermissionsService } from '@/permissions';

export const TOKEN_PROFILE_ROLES_DEFINITION = 'PROFILE_ROLES_DEFINITION';
export const TOKEN_DEFAULT_PROFILE_PERMISSIONS = 'DEFAULT_PROFILE_PERMISSIONS';

@Injectable()
export class ProfilePermissionsService extends PermissionsService<ProfileContext> {
  constructor(
    @Optional()
    @Inject(TOKEN_PROFILE_ROLES_DEFINITION)
    private rolesDefinition: IProfileRoleDefinition[],
    @Optional()
    @Inject(TOKEN_DEFAULT_PROFILE_PERMISSIONS)
    private defaultPermissions: IDefaultRolePermissions,
  ) {
    super();
    this.rolesDefinition = this.rolesDefinition || defaultProfileRolesDefinition;
    this.defaultPermissions = this.defaultPermissions || {};

    // TODO: validate definition, e.g.
    //  - remove sub roles if parent is not extendable
    //  - all default base roles need to be present
    //  - owner rule needs to be index 0
    //  - sub role needs to have higher index as parent
    //  - sub role needs to have lower index as next parent
    //  - do not change the index of sub roles
  }

  registerDefaultPermissions(permissions: IProfileRolePermission[]) {
    for (const permission of permissions) {
      this.defaultPermissions[permission.permission] = permission.role;
    }
  }

  async checkPermission(profileRelations: ProfileContext, permission: string): Promise<boolean> {
    const { profile } = profileRelations;

    if (!profile) {
      return false;
    }

    if (profileRelations.getRelationByRole(BaseMembershipRole.Owner)) {
      return true;
    }

    let userInheritsRole = false;
    for (let i = 0; i < this.rolesDefinition.length; i++) {
      const roleDef = this.rolesDefinition[i];
      if (profileRelations.getRelationByRole(roleDef.role)) {
        userInheritsRole = true;
      }

      if (!userInheritsRole) {
        continue;
      }

      for (const rolePermission of profile.getPermissionsByRole(roleDef.role)) {
        if (minimatch(permission, rolePermission.permission)) {
          return true;
        }
      }
    }

    return this.checkDefaultPermission(permission, profileRelations);
  }

  private checkDefaultPermission(permission: string, profileRelations: ProfileContext): boolean {
    for (const defaultPermission in this.defaultPermissions) {
      if (
        minimatch(permission, defaultPermission) &&
        this.userInheritsRole(profileRelations, this.defaultPermissions[defaultPermission])
      ) {
        return true;
      }
    }

    return false;
  }

  public userInheritsRole(profileRelations: ProfileContext, role: string) {
    if (!role) return false;

    for (let i = 0; i < this.rolesDefinition.length; i++) {
      const roleDef = this.rolesDefinition[i];
      if (profileRelations.getRelationByRole(roleDef.role)) {
        return true;
      }

      if (roleDef.role === role) {
        // We are sure the user does not have a role with the required permission level
        break;
      }
    }

    return false;
  }
  // TODO: assemble all permissions of a user in auth
}
