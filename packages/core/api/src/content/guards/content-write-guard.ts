import { Injectable, Inject } from '@nestjs/common';
import { ContentWritePolicy } from '../policies';
import { AbstractContentGuard } from './abstract-content.guard';
import { ProfileContentContext } from '../schemas';

@Injectable()
export class ContentWriteGuard extends AbstractContentGuard {
  @Inject()
  protected writePolicy: ContentWritePolicy;

  async canActivateContent(context: ProfileContentContext): Promise<boolean> {
    return this.writePolicy.verify(context);
  }

  isContentRequired(): boolean {
    return true;
  }
}
