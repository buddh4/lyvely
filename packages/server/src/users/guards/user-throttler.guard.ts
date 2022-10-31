import { ReverseProxyThrottlerGuard } from '@/throttler';
import { UserRequest } from '@/users';
import { ExecutionContext } from '@nestjs/common';
import { USER_THROTTLER_LIMIT, USER_THROTTLER_TTL } from '@/users/decorators/user-throttle.decorator';

export class UserThrottlerGuard extends ReverseProxyThrottlerGuard {
  protected override async handleRequest(context: ExecutionContext, limit: number, ttl: number): Promise<boolean> {
    const { req } = this.getRequestResponse(context);

    if (!req.user) return true;

    const handler = context.getHandler();
    const classRef = context.getClass();

    limit = this.reflector.getAllAndOverride<number>(USER_THROTTLER_LIMIT, [handler, classRef]);
    ttl = this.reflector.getAllAndOverride<number>(USER_THROTTLER_TTL, [handler, classRef]);

    if (!limit || !ttl) return true;

    return super.handleRequest(context, limit, ttl);
  }

  protected override getTracker(req: UserRequest): string {
    return req.user?.id ? req.user.id : super.getTracker(req);
  }
}
