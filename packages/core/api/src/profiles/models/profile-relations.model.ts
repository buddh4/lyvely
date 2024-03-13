import { UserProfileRelation } from '../schemas';
import { BaseModel, PropertyType } from '@lyvely/common';

export class ProfileRelations {
  @PropertyType([UserProfileRelation])
  profileRelations: UserProfileRelation[];

  constructor(data?: ProfileRelations) {
    BaseModel.init(this, data);
  }
}
