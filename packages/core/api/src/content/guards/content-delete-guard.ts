import { Injectable, Inject } from '@nestjs/common';
import { ContentDeletePolicy } from '../policies';
import { AbstractContentGuard } from './abstract-content.guard';
import { ProfileContentContext } from '../schemas';

@Injectable()
export class ContentDeleteGuard extends AbstractContentGuard {
  @Inject()
  protected deletePolicy: ContentDeletePolicy;

  async canActivateContent(context: ProfileContentContext): Promise<boolean> {
    return this.deletePolicy.verify(context);
  }

  isContentRequired(): boolean {
    return true;
  }
}
