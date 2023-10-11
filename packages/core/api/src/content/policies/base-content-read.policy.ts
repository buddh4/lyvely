import { Inject, Injectable } from '@nestjs/common';
import { IContentPolicy } from '../interfaces';
import { ProfileContentContext } from '../schemas';
import { ModuleRef } from '@nestjs/core';
import { ProfilePermissionsService } from '@/profiles';

@Injectable()
export abstract class BaseContentReadPolicy implements IContentPolicy {
  @Inject()
  protected moduleRef: ModuleRef;

  async verify(context: ProfileContentContext): Promise<boolean> {
    const permissionsService = this.moduleRef.get(ProfilePermissionsService, { strict: false });
    const visibilityLevel = permissionsService.getVisibilityLevel(context);
    return visibilityLevel <= context.content.meta.visibility;
  }
}
