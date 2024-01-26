import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { GlobalPermissionsService } from '@/permissions';
import { Reflector } from '@nestjs/core';
import { ProfilePermissionsService } from '../services';
import { BasePermissionType, getPermission, IntegrityException } from '@lyvely/interface';
import { User } from '@/users';
import { META_PERMISSIONS_SOME, META_PERMISSIONS_STRICT } from '@/profiles';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject()
  protected reflector: Reflector;

  @Inject()
  private globalPermissionsService: GlobalPermissionsService;

  @Inject()
  private profilePermissionsService: ProfilePermissionsService;

  canActivate(context: ExecutionContext): boolean {
    const permissionIds = this.getPermissionsFromContext(context);
    const request = context.switchToHttp().getRequest();

    const { context: requestContext, user } = request;

    if (!permissionIds?.length) return true;
    return (
      this.verifyAny(requestContext, user, this.getPermissionsFromContext(context)) &&
      this.verifyEach(requestContext, user, this.getStrictPermissionsFromContext(context))
    );
  }

  private getStrictPermissionsFromContext(context: ExecutionContext) {
    return (
      this.reflector.getAllAndMerge<string[]>(META_PERMISSIONS_STRICT, [
        context.getHandler(),
        context.getClass(),
      ]) || []
    );
  }

  private getPermissionsFromContext(context: ExecutionContext) {
    return (
      this.reflector.getAllAndMerge<string[]>(META_PERMISSIONS_SOME, [
        context.getHandler(),
        context.getClass(),
      ]) || []
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
