import { ReverseProxyThrottlerGuard } from '@/core';
import { UserRequest } from '../types';
import { ExecutionContext } from '@nestjs/common';
import { USER_THROTTLER_LIMIT, USER_THROTTLER_TTL } from '../decorators';
import {
  ThrottlerGenerateKeyFunction,
  ThrottlerGetTrackerFunction,
  ThrottlerOptions,
} from '@nestjs/throttler/dist/throttler-module-options.interface';

export class UserThrottlerGuard extends ReverseProxyThrottlerGuard {
  protected override async handleRequest(
    context: ExecutionContext,
    limit: number,
    ttl: number,
    throttler: ThrottlerOptions,
    getTracker: ThrottlerGetTrackerFunction,
    generateKey: ThrottlerGenerateKeyFunction
  ): Promise<boolean> {
    const { req } = this.getRequestResponse(context);

    if (!req.user) return true;

    const handler = context.getHandler();
    const classRef = context.getClass();

    limit = this.reflector.getAllAndOverride<number>(USER_THROTTLER_LIMIT, [handler, classRef]);
    ttl = this.reflector.getAllAndOverride<number>(USER_THROTTLER_TTL, [handler, classRef]);

    if (!limit || !ttl) return true;

    return super.handleRequest(context, limit, ttl, throttler, getTracker, generateKey);
  }

  protected override async getTracker(req: UserRequest): Promise<string> {
    return req.user?.id ? req.user.id : await super.getTracker(req);
  }
}
