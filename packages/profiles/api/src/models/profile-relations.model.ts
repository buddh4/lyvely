import { Profile, UserProfileRelation } from '../schemas';
import { BaseModel, PropertyType } from '@lyvely/common';
import { User } from '@lyvely/users';

export class ProfileRelations extends BaseModel<ProfileRelations> {
  profile: Profile;
  user: User;

  @PropertyType([UserProfileRelation])
  userRelations: UserProfileRelation[];

  @PropertyType([UserProfileRelation])
  profileRelations: UserProfileRelation[];
}
