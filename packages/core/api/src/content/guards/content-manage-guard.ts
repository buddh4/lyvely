import { Injectable, Inject } from '@nestjs/common';
import { AbstractContentGuard } from './abstract-content.guard';
import { ProfileContentContext } from '../schemas';
import { ContentManagePolicy } from '../policies/content-manage.policy';

@Injectable()
export class ContentManageGuard extends AbstractContentGuard {
  @Inject()
  protected managePolicy: ContentManagePolicy;

  async canActivateContent(context: ProfileContentContext): Promise<boolean> {
    return this.managePolicy.verify(context);
  }

  isContentRequired(): boolean {
    return true;
  }
}
