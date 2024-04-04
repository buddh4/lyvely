import { Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ContentPermissionsService } from '../services/content-permissions.service';
import { IContentPolicy } from '../interfaces';
import { ProfileContentContext } from '../schemas';

export abstract class BaseContentPolicy implements IContentPolicy {
  @Inject()
  protected readonly moduleRef: ModuleRef;

  private contentPermissionsService: ContentPermissionsService;

  abstract verify(context: ProfileContentContext): Promise<boolean>;

  /**
   * Retrieves the Content Permissions Service instance.
   *
   * @protected
   *
   * @return {ContentPermissionsService} The Content Permissions Service instance.
   */
  protected getContentPermissionsService() {
    /**
     *  Note: We do not directly inject the service, since policies should not inject any non core and non-global
     *  dependencies except other policies directly. Since the policy will be part of the policy module and in some
     *  cases policies are provided without the related module being active.
     */
    if (!this.contentPermissionsService) {
      this.contentPermissionsService = this.moduleRef.get(ContentPermissionsService);
    }
    return this.contentPermissionsService;
  }
}
