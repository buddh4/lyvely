import { Injectable } from '@nestjs/common';
import { IContentPolicy } from '../interfaces';
import { ProfileContentContext } from '../models';

@Injectable()
export abstract class BaseContentManagePolicy implements IContentPolicy {
  async verify(context: ProfileContentContext): Promise<boolean> {
    return context.isOwner();
  }
}
