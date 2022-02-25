import { Injectable, ExecutionContext, Inject } from '@nestjs/common';
import { ContentWritePolicy } from '../policies/content-write.policy';
import { PolicyService } from '../../policies/services/policy.service';
import { AbstractContentGuard } from './abstract-content-guard';

@Injectable()
export class WritableContentGuard extends AbstractContentGuard {

  @Inject()
  protected policyService: PolicyService;

  @Inject()
  protected writePolicy: ContentWritePolicy;

  async canActivateContent(context: ExecutionContext): Promise<boolean> {
    if(!await super.canActivate(context)) {
      return false;
    }

    return this.policyService.check(context, this.writePolicy);
  }
}