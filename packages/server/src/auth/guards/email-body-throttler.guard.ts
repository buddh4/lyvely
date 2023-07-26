import { LyvelyRequest } from '@lyvely/core';
import { ExecutionContext } from '@nestjs/common';
import { ReverseProxyThrottlerGuard } from '@/throttler';
import { USER_THROTTLER_LIMIT, USER_THROTTLER_TTL } from '@/users';

export class EmailBodyThrottlerGuard extends ReverseProxyThrottlerGuard {
  protected override async handleRequest(
    context: ExecutionContext,
    limit: number,
    ttl: number,
  ): Promise<boolean> {
    const { req } = this.getRequestResponse(context);

    if (!req.body.email) return true;

    const handler = context.getHandler();
    const classRef = context.getClass();

    limit =
      this.reflector.getAllAndOverride<number>(USER_THROTTLER_LIMIT, [handler, classRef]) || 20;
    ttl = this.reflector.getAllAndOverride<number>(USER_THROTTLER_TTL, [handler, classRef]) || 60;

    return await super.handleRequest(context, limit, ttl);
  }

  protected override getTracker(req: LyvelyRequest): string {
    return req.body.email + ':' + super.getTracker(req);
  }
}
