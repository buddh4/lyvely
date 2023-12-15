import { Injectable } from '@nestjs/common';
import { IContentPolicy } from '../interfaces';
import { ProfileContentContext } from '../schemas';
import { UserStatus } from '@lyvely/interface';

/**
 * A helper content policy which grants access to active authors of a content.
 */
@Injectable()
export class ContentAuthorPolicy implements IContentPolicy {
  async verify(context: ProfileContentContext): Promise<boolean> {
    const { content, user } = context;
    return user?.status === UserStatus.Active && content.isAuthor(user);
  }
}
