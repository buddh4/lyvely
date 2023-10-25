import { UserProfileRelation } from '../schemas';
import { BaseModel, PropertyType } from '@lyvely/common';

export class ProfileRelations extends BaseModel<ProfileRelations> {
  @PropertyType([UserProfileRelation])
  profileRelations: UserProfileRelation[];
}
