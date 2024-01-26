import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import {
  getPermissionsFromContext,
  getStrictPermissionsFromContext,
  GlobalPermissionsService,
} from '@/permissions';
import { Reflector } from '@nestjs/core';
import { OptionalUserRequest } from '@/users';

/**
 * Guards against unauthorized access based on global permissions supporting the @Permissions and @StrictPermissions
 * decorator.
 */
export class GlobalPermissionsGuard implements CanActivate {
  @Inject()
  protected reflector: Reflector;

  @Inject()
  private readonly globalPermissionsService: GlobalPermissionsService;

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<OptionalUserRequest>();
    const strictPermissions = getStrictPermissionsFromContext(context, this.reflector);
    const permissions = getPermissionsFromContext(context, this.reflector);

    return (
      this.globalPermissionsService.verifyAnyPermission(request.user, ...permissions) &&
      this.globalPermissionsService.verifyEveryPermission(request.user, ...strictPermissions)
    );
  }
}
