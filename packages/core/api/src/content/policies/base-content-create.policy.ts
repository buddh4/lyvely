import { Inject, Injectable } from '@nestjs/common';
import { IContentPolicy } from '../interfaces';
import { ModuleRef } from '@nestjs/core';
import { ProfileContext } from '@/profiles';

@Injectable()
export abstract class BaseContentCreatePolicy implements IContentPolicy {
  @Inject()
  protected moduleRef: ModuleRef;

  async verify(context: ProfileContext): Promise<boolean> {
    return context.isProfileMember();
  }
}
