import { Injectable, ExecutionContext, Inject } from '@nestjs/common';
import { ContentWritePolicy } from '../policies';
import { PolicyService } from '@lyvely/policies';
import { AbstractContentGuard } from './abstract-content.guard';
import { ProfileContext } from '@lyvely/profiles';
import { Content } from '../schemas';

@Injectable()
export class WritableContentGuard extends AbstractContentGuard {
  @Inject()
  protected policyService: PolicyService;

  @Inject()
  protected writePolicy: ContentWritePolicy;

  async canActivateContent(
    profileRelations: ProfileContext,
    content: Content,
    context: ExecutionContext,
  ): Promise<boolean> {
    return this.policyService.check(context, this.writePolicy);
  }
}
