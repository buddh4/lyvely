import { Inject, Injectable } from '@nestjs/common';
import { IContentPolicy } from '../interfaces';
import { ProfileContentContext } from '../schemas';
import { InjectPolicy } from '@/policies';
import { ContentManagePolicy } from './content-manage.policy';
import { BasePermissionType, getContentDeletePermissionId, getPermission } from '@lyvely/interface';
import { ContentPermissionsService } from '../services/content-permissions.service';

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
export abstract class BaseContentDeletePolicy implements IContentPolicy {
  @InjectPolicy(ContentManagePolicy.name)
  private readonly managePolicy: ContentManagePolicy;

  @Inject()
  protected readonly contentPermissionsService: ContentPermissionsService;

  async verify(context: ProfileContentContext): Promise<boolean> {
    const { content } = context;

    const permission = getPermission(
      getContentDeletePermissionId(content.type),
      BasePermissionType.Content,
    );

    if (permission && this.contentPermissionsService.verifyPermission(context, permission)) {
      return true;
    }

    return this.managePolicy.verify(context);
  }
}
