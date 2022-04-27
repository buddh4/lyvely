import { Injectable } from '@nestjs/common';
import { AbstractDao } from '../../db/abstract.dao';
import { ProfileScoreAction } from '../schemas';

@Injectable()
export abstract class ProfileScoreActionDao<T extends ProfileScoreAction = ProfileScoreAction> extends AbstractDao<T>{
  protected getModelType(): string | null {
    return 'userprofileaction';
  }
}
