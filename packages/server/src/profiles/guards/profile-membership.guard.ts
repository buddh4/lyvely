import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ProfileRequest } from '../types';

@Injectable()
export class ProfileMembershipGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<ProfileRequest>();
    return !!request.context.getMembership();
  }
}
