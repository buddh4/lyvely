import { Injectable, Inject } from '@nestjs/common';
import { ContentReadPolicy } from '../policies';
import { ProfileContentContext } from '../models';
import { AbstractContentGuard } from './abstract-content.guard';

@Injectable()
export class ReadableContentGuard extends AbstractContentGuard {
  @Inject()
  protected readPolicy: ContentReadPolicy;

  async canActivateContent(context: ProfileContentContext): Promise<boolean> {
    return this.readPolicy.verify(context);
  }
}
