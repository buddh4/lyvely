import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReverseProxyThrottlerGuard extends ThrottlerGuard {
  protected override getTracker(req: Record<string, any>): string {
    return req.ips.length ? req.ips[0] : req.ip;
  }
}
