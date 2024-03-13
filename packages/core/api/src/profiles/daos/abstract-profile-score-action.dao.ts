import { Injectable } from '@nestjs/common';
import { AbstractDao } from '@/core';
import { ProfileScore } from '../schemas';

@Injectable()
export abstract class ProfileScoreDao<
  T extends ProfileScore = ProfileScore,
> extends AbstractDao<T> {
  protected override getModelType(): string | null {
    return 'userprofileaction';
  }
}
