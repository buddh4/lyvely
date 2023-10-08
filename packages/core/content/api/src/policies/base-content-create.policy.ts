import { Inject, Injectable } from '@nestjs/common';
import { IContentPolicy } from '../interfaces';
import { ProfileContentContext } from '../schemas';
import { ModuleRef } from '@nestjs/core';
import { ProfileContext, ProfilePermissionsService } from '@lyvely/profiles';

@Injectable()
export abstract class BaseContentCreatePolicy implements IContentPolicy {
  @Inject()
  protected moduleRef: ModuleRef;

  async verify(context: ProfileContext): Promise<boolean> {
    return context.isProfileMember();
  }
}
