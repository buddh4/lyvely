import { Injectable, Inject, CanActivate, ExecutionContext } from '@nestjs/common';
import { ContentCreatePolicy } from '../policies';
import { ProfileRequest } from '@lyvely/profiles';

@Injectable()
export class ContentCreateGuard implements CanActivate {
  @Inject()
  protected createPolicy: ContentCreatePolicy;

  async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const request = executionContext.switchToHttp().getRequest<ProfileRequest>();
    const { context } = request;
    return this.createPolicy.verify(context);
  }
}
