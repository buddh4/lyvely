import { UserProfileRelation } from '../schemas';
import { AbstractUserProfileRelationsDao } from './abstract-user-profile-relations.dao';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from '@/core';
import { Type } from '@lyvely/common';

@Injectable()
export class UserProfileRelationsDao extends AbstractUserProfileRelationsDao {
  constructor(@InjectModel(UserProfileRelation.name) protected model: Model<UserProfileRelation>) {
    super();
  }

  getModelConstructor(): Type<UserProfileRelation> {
    return UserProfileRelation;
  }

  getModuleId(): string {
    return 'profiles';
  }
}
