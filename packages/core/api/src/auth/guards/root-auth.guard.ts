import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { type AuthModuleConfig, IS_PUBLIC_KEY } from '@/core';
import { extractAuthCookie, JWT_ACCESS_TOKEN } from './strategies';
import { firstValueFrom } from 'rxjs';
import { VisitorMode, Headers, ForbiddenServiceException } from '@lyvely/interface';
import { Request } from 'express';
import { type OptionalUserRequest } from '@/users';
import { LyvelyConfigService } from '@/config';
import { type IPermissionConfig } from '@lyvely/interface';

@Injectable()
export class RootAuthGuard extends AuthGuard(JWT_ACCESS_TOKEN) {
  private readonly logger = new Logger(RootAuthGuard.name);

  constructor(
    private reflector: Reflector,
    private configService: LyvelyConfigService<AuthModuleConfig>
  ) {
    super();
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<OptionalUserRequest>();

    // Public access, but we try to verify the user anyway
    if (isPublic) {
      return this.handlePublicAccess(request, context);
    }

    // If we have an auth cookie, we know it is a request attempt from an actual user.
    if (extractAuthCookie(request, this.configService)) {
      return this.verifyAuthCookie(context);
    }

    if (this.isVisitorRequest(request)) {
      return this.handleGuestAccess();
    }

    throw new UnauthorizedException();
  }

  async handlePublicAccess(request: Request, context: ExecutionContext) {
    try {
      if (extractAuthCookie(request, this.configService)) {
        await this.verifyAuthCookie(context);
      }
    } catch (e) {
      this.logger.warn('Public access with jwt verification error.', e);
    }

    return true;
  }

  async verifyAuthCookie(context: ExecutionContext): Promise<boolean> {
    try {
      const result = super.canActivate(context);
      if (typeof result === 'boolean') return result;
      if (result instanceof Promise) return await result;
      return await firstValueFrom(result);
    } catch (e) {
      return this.handleActivationError(context.switchToHttp().getRequest<Request>(), e);
    }
  }

  async handleActivationError(request: Request, error: unknown) {
    if (error instanceof ForbiddenServiceException || error instanceof ForbiddenException) {
      throw error;
    }

    if (this.isVisitorRequest(request)) {
      return this.handleGuestAccess();
    }

    // Probably user access with expired access token, which is handled by the frontend or an unknown error.
    throw error;
  }

  private isVisitorRequest(request: Request) {
    return request.header(Headers.X_VISITOR_ACCESS) === '1';
  }

  async handleGuestAccess() {
    const visitorStrategy = this.configService.getModuleConfig<IPermissionConfig>('permissions');
    if (visitorStrategy.visitorStrategy.mode !== VisitorMode.Enabled) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
