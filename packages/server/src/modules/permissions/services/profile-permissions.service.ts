import { Inject, Injectable, Optional } from '@nestjs/common';
import { UserProfileRelation, UserWithProfileAndRelations } from '../../profiles';
import minimatch from 'minimatch';
import { BaseMembershipRole } from '@lyvely/common';
import {
  defaultProfileRolesDefinition, DefaultRolePermissions,
  ProfileRoleDefinition,
  ProfileRolePermission
} from '../interfaces/profile-permissions.interface';

export const TOKEN_PROFILE_ROLES_DEFINITION = 'PROFILE_ROLES_DEFINITION';
export const TOKEN_DEFAULT_PROFILE_PERMISSIONS = 'DEFAULT_PROFILE_PERMISSIONS';

@Injectable()
export class ProfilePermissionsService {

  constructor(
    @Optional() @Inject(TOKEN_PROFILE_ROLES_DEFINITION) private rolesDefinition: ProfileRoleDefinition[],
    @Optional() @Inject(TOKEN_DEFAULT_PROFILE_PERMISSIONS) private defaultPermissions: DefaultRolePermissions
  ) {
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

  registerDefaultPermissions(permissions: ProfileRolePermission[]) {
    for(const permission of permissions) {
      this.defaultPermissions[permission.permission] = permission.role;
    }
  }

  async checkEveryPermission(profileRelations: UserWithProfileAndRelations, ...permissions: string[]): Promise<boolean>  {
    const promises = permissions.map(permission => this.checkPermission(profileRelations, permission));
    return !(await Promise.all(promises)).includes(false);
  }

  async checkSomePermission(profileRelations: UserWithProfileAndRelations, ...permissions: string[]): Promise<boolean>  {
    const promises = permissions.map(permission => this.checkPermission(profileRelations, permission));
    return (await Promise.all(promises)).includes(true);
  }

  async checkPermission(profileRelations: UserWithProfileAndRelations, permission: string): Promise<boolean>  {
    const { profile } = profileRelations;

    if(!profile) {
      return false;
    }

    if(profileRelations.getRelationByRole(BaseMembershipRole.Owner)) {
      return true;
    }

    let userInheritsRole = false;
    for(let i = 0;i < this.rolesDefinition.length;i++) {
      const roleDef =  this.rolesDefinition[i];
      if(profileRelations.getRelationByRole(roleDef.role)) {
        userInheritsRole = true;
      }

      if(!userInheritsRole) {
        continue;
      }

      for(const rolePermission of profile.getPermissionsByRole(roleDef.role)) {
        if(minimatch(permission, rolePermission.permission)) {
          return true;
        }
      }
    }

    return this.checkDefaultPermission(permission, profileRelations);
  }

  private checkDefaultPermission(permission: string, profileRelations: UserWithProfileAndRelations): boolean {
    for(const defaultPermission in this.defaultPermissions) {
      if(minimatch(permission, defaultPermission) && this.userInheritsRole(profileRelations, this.defaultPermissions[defaultPermission])) {
        return true;
      }
    }

    return false;
  }

  public userInheritsRole(profileRelations: UserWithProfileAndRelations, role: string) {
    if(!role) return false;

    for(let i = 0;i < this.rolesDefinition.length;i++) {
      const roleDef =  this.rolesDefinition[i];
      if(profileRelations.getRelationByRole(roleDef.role)) {
        return true;
      }

      if(roleDef.role === role) {
        // We are sure the user does not have a role with the required permission level
        break;
      }
    }

    return false;
  }

  private getPermissionLevel(relationOrRole: UserProfileRelation|string) {
    const role = typeof relationOrRole === 'string' ? relationOrRole : relationOrRole.role;
    const index = this.rolesDefinition.findIndex((roleDef) => roleDef.role === role);
    return index > 0 ? index : this.rolesDefinition.length -1;
  }

  // TODO: assemble all permissions of a user in auth
}
