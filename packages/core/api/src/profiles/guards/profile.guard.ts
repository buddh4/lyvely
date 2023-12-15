import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { ProfileRequest } from '../types';
import { ProfileContext } from '../models';
import { getPermissionsFromContext, getStrictPermissionsFromContext } from '@/permissions';
import { BaseProfileGuard } from './base-profile-guard.service';
import { ProfilePermissionsService } from '@/profiles';

/**
 * Represents a guard for profile context access.
 *
 * This guard will try to extract a profile id from the request usually by :pid parameter and then will add the
 * ProfileContext to the request object.
 *
 * This guard also includes a check for the @ProfileRoleLevel decorator as well as a profile visibility check.
 *
 * This guard furthermore includes a profile permission checks supporting the @@Permissions and @StrictPermissions decorators
 * with global and profile level permissions.
 */
@Injectable()
export class ProfileGuard extends BaseProfileGuard implements CanActivate {
  @Inject()
  protected profilePermissionService: ProfilePermissionsService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!super.canActivate(context)) return false;

    const request = context.switchToHttp().getRequest<ProfileRequest>();
    return this.verifyPermissions(request.context, context);
  }

  verifyPermissions(contentContext: ProfileContext, context: ExecutionContext) {
    const strictPermissions = getStrictPermissionsFromContext(context, this.reflector);
    const permissions = getPermissionsFromContext(context, this.reflector);

    return (
      this.profilePermissionService.verifyAnyPermission(contentContext, ...permissions) &&
      this.profilePermissionService.verifyEveryPermission(contentContext, ...strictPermissions)
    );
  }
}
