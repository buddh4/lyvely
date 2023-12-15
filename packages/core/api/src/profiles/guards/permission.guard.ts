import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import {
  getPermissionsFromContext,
  getStrictPermissionsFromContext,
  GlobalPermissionsService,
} from '@/permissions';
import { Reflector } from '@nestjs/core';
import { ProfilePermissionsService } from '../services';
import { BasePermissionType, getPermission, IntegrityException } from '@lyvely/interface';
import { User } from '@/users';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject()
  protected reflector: Reflector;

  @Inject()
  private globalPermissionsService: GlobalPermissionsService;

  @Inject()
  private profilePermissionsService: ProfilePermissionsService;

  canActivate(context: ExecutionContext): boolean {
    const permissionIds = getPermissionsFromContext(context, this.reflector);
    const request = context.switchToHttp().getRequest();

    const { context: requestContext, user } = request;

    if (!permissionIds?.length) return true;
    return (
      this.verifyAny(requestContext, user, getPermissionsFromContext(context, this.reflector)) &&
      this.verifyEach(
        requestContext,
        user,
        getStrictPermissionsFromContext(context, this.reflector),
      )
    );
  }

  private verifyEach(context: any, user: User | undefined, permissionIds: string[]) {
    if (!permissionIds?.length) return true;
    return permissionIds.reduce(
      (result, permissionId) => result && this.verifyPermission(context, user, permissionId),
      true,
    );
  }

  private verifyAny(context: any, user: User | undefined, permissionIds: string[]) {
    if (!permissionIds?.length) return true;
    return permissionIds.reduce(
      (result, permissionId) => result || this.verifyPermission(context, user, permissionId),
      false,
    );
  }

  private verifyPermission(context: any, user: User | undefined, permissionId: string) {
    const permission = getPermission(permissionId);
    if (!permission) throw new IntegrityException('Could not find permission ' + permissionId);
    switch (permission.type) {
      case BasePermissionType.Profile:
        return this.profilePermissionsService.verifyPermission(context, permission.id);
      case BasePermissionType.Global:
        return this.globalPermissionsService.verifyPermission(context.user, permission.id);
    }
    // TODO: Support of user permissions
    return false;
  }
}
