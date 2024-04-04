import { Injectable } from '@nestjs/common';
import { ProfileContentContext } from '../schemas';
import { InjectPolicy } from '@/policies';
import { ContentManagePolicy } from './content-manage.policy';
import { BasePermissionType, getContentDeletePermissionId, getPermission } from '@lyvely/interface';
import { BaseContentPolicy } from './base-content.policy';

/**
 * Represents the default content delete policy, responsible for granting access to content archive and delete features.
 *
 * By default, delete access is granted if either a content type delete permission is granted or the `ContentManagePolicy`
 * check passes.
 *
 * This policy may be re-used in custom delete policies.
 *
 * @abstract
 * @implements {IContentPolicy}
 */
@Injectable()
export abstract class BaseContentDeletePolicy extends BaseContentPolicy {
  @InjectPolicy(ContentManagePolicy.name)
  protected readonly managePolicy: ContentManagePolicy;

  async verify(context: ProfileContentContext): Promise<boolean> {
    const { content } = context;

    const permission = getPermission(
      getContentDeletePermissionId(content.type),
      BasePermissionType.Content,
    );

    if (permission && this.getContentPermissionsService().verifyPermission(context, permission)) {
      return true;
    }

    return this.managePolicy.verify(context);
  }
}
