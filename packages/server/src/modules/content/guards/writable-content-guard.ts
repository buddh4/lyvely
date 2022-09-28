import { Injectable, ExecutionContext, Inject } from '@nestjs/common';
import { ContentWritePolicy } from '../policies';
import { PolicyService } from '../../policies/services/policy.service';
import { AbstractContentGuard } from './abstract-content-guard';
import { UserWithProfileAndRelations } from '../../profiles';
import { Content } from '../schemas';

@Injectable()
export class WritableContentGuard extends AbstractContentGuard {
  @Inject()
  protected policyService: PolicyService;

  @Inject()
  protected writePolicy: ContentWritePolicy;

  async canActivateContent(
    profileRelations: UserWithProfileAndRelations,
    content: Content,
    context: ExecutionContext,
  ): Promise<boolean> {
    return this.policyService.check(context, this.writePolicy);
  }
}
