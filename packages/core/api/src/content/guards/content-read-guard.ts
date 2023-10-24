import { Injectable, Inject } from '@nestjs/common';
import { ContentReadPolicy } from '../policies';
import { ProfileContentContext } from '../schemas';
import { AbstractContentGuard } from './abstract-content.guard';

@Injectable()
export class ContentReadGuard extends AbstractContentGuard {
  @Inject()
  protected readPolicy: ContentReadPolicy;

  async canActivateContent(context: ProfileContentContext): Promise<boolean> {
    return this.readPolicy.verify(context);
  }

  isContentRequired(): boolean {
    return true;
  }
}
