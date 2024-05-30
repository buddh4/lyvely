import { LyvelyRequest, ReverseProxyThrottlerGuard } from '@/core';
import { ExecutionContext } from '@nestjs/common';
import { USER_THROTTLER_LIMIT, USER_THROTTLER_TTL } from '@/users';
import { LoginModel } from '@lyvely/interface';
import {
  ThrottlerGenerateKeyFunction,
  ThrottlerGetTrackerFunction,
  ThrottlerOptions,
} from '@nestjs/throttler';

export class LoginThrottlerGuard extends ReverseProxyThrottlerGuard {
  protected override async handleRequest(
    context: ExecutionContext,
    limit: number,
    ttl: number,
    throttler: ThrottlerOptions,
    getTracker: ThrottlerGetTrackerFunction,
    generateKey: ThrottlerGenerateKeyFunction
  ): Promise<boolean> {
    const { req } = this.getRequestResponse(context);

    if (!(<LoginModel>req.body).usernameOrEmail) return true;

    const handler = context.getHandler();
    const classRef = context.getClass();

    limit =
      process.env.NODE_ENV === 'e2e'
        ? Number.MAX_VALUE
        : this.reflector.getAllAndOverride<number>(USER_THROTTLER_LIMIT, [handler, classRef]) || 20;
    ttl =
      this.reflector.getAllAndOverride<number>(USER_THROTTLER_TTL, [handler, classRef]) || 60_000;

    return await super.handleRequest(context, limit, ttl, throttler, getTracker, generateKey);
  }

  protected override async getTracker(req: LyvelyRequest): Promise<string> {
    return req.body.email + ':' + (await super.getTracker(req));
  }
}
