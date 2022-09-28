import { UserProfileRelation, UserProfileRelationDocument } from '../schemas';
import { AbstractUserProfileRelationsDao } from './abstract-user-profile-relations.dao';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Constructor } from '@lyvely/common';

@Injectable()
export class UserProfileRelationsDao extends AbstractUserProfileRelationsDao {
  constructor(@InjectModel(UserProfileRelation.name) protected model: Model<UserProfileRelationDocument>) {
    super();
  }

  getModelConstructor(): Constructor<UserProfileRelation> {
    return UserProfileRelation;
  }

  getModuleId(): string {
    return 'profiles';
  }
}
