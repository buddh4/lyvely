import { Injectable } from '@nestjs/common';
import { ProfileContentContext } from '../schemas';
import { getProfileRoleLevel } from '@lyvely/interface';
import { BaseContentPolicy } from './base-content.policy';

/**
 * Represents a base content read policy.
 * This policy will check the user role level against the content visibility level.
 * @implements {IContentPolicy}
 * @abstract
 */
@Injectable()
export abstract class BaseContentReadPolicy extends BaseContentPolicy {
  async verify(context: ProfileContentContext): Promise<boolean> {
    return getProfileRoleLevel(context.getRole()) <= context.content.meta.visibility;
  }
}
