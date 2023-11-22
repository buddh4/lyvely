import { Inject, Injectable } from '@nestjs/common';
import { IContentPolicy } from '../interfaces';
import { ProfileContentContext } from '../schemas';
import { ModuleRef } from '@nestjs/core';
import { getProfileRoleVisibilityLevel } from '@lyvely/interface';

@Injectable()
export abstract class BaseContentReadPolicy implements IContentPolicy {
  @Inject()
  protected moduleRef: ModuleRef;

  async verify(context: ProfileContentContext): Promise<boolean> {
    return getProfileRoleVisibilityLevel(context.getRole()) <= context.content.meta.visibility;
  }
}
