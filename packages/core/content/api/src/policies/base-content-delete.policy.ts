import { Injectable } from '@nestjs/common';
import { IContentPolicy } from '../interfaces';
import { ProfileContentContext } from '../schemas';

@Injectable()
export abstract class BaseContentDeletePolicy implements IContentPolicy {
  async verify(context: ProfileContentContext): Promise<boolean> {
    if (!context.user) return false;
    return context.content.meta.createdBy._id.equals(context.user._id);
  }
}
