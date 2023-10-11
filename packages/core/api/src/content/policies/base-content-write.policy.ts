import { Injectable } from '@nestjs/common';
import { IContentPolicy } from '../interfaces';
import { ProfileContentContext } from '../schemas';

@Injectable()
export abstract class BaseContentWritePolicy implements IContentPolicy {
  async verify(context: ProfileContentContext): Promise<boolean> {
    if (!context.user) return false;
    return context.content._id.equals(context.user._id);
  }
}
