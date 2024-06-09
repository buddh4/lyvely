import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { OptionalUserRequest } from '../types';
import { META_USER_ROLE_ACCESS, META_USER_STATUS_ACCESS } from '../users.constants';
import { UserRole, verifyUserRoleLevel, UserStatus } from '@lyvely/interface';
import { Reflector } from '@nestjs/core';

/**
 * Class representing a base user guard.
 *
 * @class
 * @implements CanActivate
 * @public
 */
@Injectable()
export class BaseUserGuard implements CanActivate {
  @Inject()
  protected reflector: Reflector;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<OptionalUserRequest>();

    if (!this.verifyUserRoleLevel(request, context)) {
      throw new ForbiddenException();
    }

    if (!this.verifyUserStatus(request, context)) {
      throw new UnauthorizedException({ userStatus: UserStatus.EmailVerification });
    }

    return true;
  }

  private verifyUserRoleLevel(request: OptionalUserRequest, context: ExecutionContext) {
    const roleRestriction = this.getUserRoleFromContext(context);
    if (!roleRestriction) return true;
    return verifyUserRoleLevel(request.user, roleRestriction);
  }

  private getUserRoleFromContext(context: ExecutionContext) {
    return this.reflector.getAllAndOverride<UserRole | undefined>(META_USER_ROLE_ACCESS, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private verifyUserStatus(request: OptionalUserRequest, context: ExecutionContext) {
    let statusRestriction = this.getUserStatusFromContext(context);

    if (statusRestriction === true) return true;

    // For visitor users we skip default status restriction check
    if (!request.user && !statusRestriction) return true;

    // By default, we expect an active user
    statusRestriction ??= UserStatus.Active;
    return statusRestriction === request.user?.status;
  }

  private getUserStatusFromContext(context: ExecutionContext) {
    return this.reflector.getAllAndOverride<UserStatus | true | undefined>(
      META_USER_STATUS_ACCESS,
      [context.getHandler(), context.getClass()]
    );
  }
}
