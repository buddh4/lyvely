import { Inject, Injectable } from '@nestjs/common';
import { IContentPolicy } from '../interfaces';
import { ProfileContentContext } from '../schemas';
import { InjectPolicy } from '@/policies';
import { ContentManagePolicy } from '@/content';
import { ContentPermissionsService } from '@/content/services/content-permissions.service';
import { BasePermissionType, getContentWritePermissionId, getPermission } from '@lyvely/interface';

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
export abstract class BaseContentWritePolicy implements IContentPolicy {
  @InjectPolicy(ContentManagePolicy.name)
  private readonly managePolicy: ContentManagePolicy;

  @Inject()
  protected readonly contentPermissionsService: ContentPermissionsService;

  async verify(context: ProfileContentContext): Promise<boolean> {
    const { content } = context;

    const permission = getPermission(
      getContentWritePermissionId(content.type),
      BasePermissionType.Content,
    );

    if (permission && this.contentPermissionsService.verifyPermission(context, permission)) {
      return true;
    }

    return this.managePolicy.verify(context);
  }
}
