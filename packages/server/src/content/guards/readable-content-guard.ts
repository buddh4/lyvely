import { Injectable, ExecutionContext, Inject } from '@nestjs/common';
import { ContentGuard } from './content.guard';
import { PolicyService } from '../../policies/services/policy.service';
import { ContentReadPolicy } from '../policies/content-read.policy';

@Injectable()
export class ReadableContentGuard extends ContentGuard {

  @Inject()
  protected policyService: PolicyService;

  @Inject()
  protected readPolicy: ContentReadPolicy;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if(!await super.canActivate(context)) {
      return false;
    }

    return this.policyService.check(context, this.readPolicy);
  }
}