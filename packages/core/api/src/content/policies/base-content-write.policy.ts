import { Injectable } from '@nestjs/common';
import { ProfileContentContext } from '../schemas';
import { InjectPolicy } from '@/policies';
import { ContentManagePolicy } from './content-manage.policy';
import { BasePermissionType, getContentWritePermissionId, getPermission } from '@lyvely/interface';
import { BaseContentPolicy } from './base-content.policy';

/**
 * Represents the default content write policy, responsible for granting access to content write features.
 *
 * By default, write access is granted if either a content type write permission is granted or the `ContentManagePolicy`
 * check passes.
 *
 * This policy may be re-used in custom delete policies.
 *
 * @abstract
 * @implements {IContentPolicy}
 */
@Injectable()
export abstract class BaseContentWritePolicy extends BaseContentPolicy {
  @InjectPolicy(ContentManagePolicy.name)
  private readonly managePolicy: ContentManagePolicy;

  async verify(context: ProfileContentContext): Promise<boolean> {
    const { content } = context;

    if (content.getTypeMeta().editable === false) return false;

    const permission = getPermission(
      getContentWritePermissionId(content.type),
      BasePermissionType.Content
    );

    if (permission && this.getContentPermissionsService().verifyPermission(context, permission)) {
      return true;
    }

    return this.managePolicy.verify(context);
  }
}
