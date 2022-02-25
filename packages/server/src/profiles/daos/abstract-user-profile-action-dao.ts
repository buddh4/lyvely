import { Injectable } from '@nestjs/common';
import { AbstractDao } from '../../db/abstract.dao';
import { ProfileAction } from '../schemas/profile-action.schema';

@Injectable()
export abstract class AbstractUserProfileActionDao<T extends ProfileAction = ProfileAction> extends AbstractDao<T>{
  protected getModelType(): string | null {
    return 'userprofileaction';
  }
}