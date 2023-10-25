import { Profile, UserProfileRelation } from '../schemas';
import { BaseModel, PropertyType } from '@lyvely/common';
import { OptionalUser } from '@/users';
import { ProfileRelationRole } from '@lyvely/core-interface';
import { ProfileRelations } from './profile-relations.model';

export class UserAndProfileRelations
  extends BaseModel<UserAndProfileRelations>
  implements ProfileRelations
{
  profile: Profile;
  user: OptionalUser;
  role: ProfileRelationRole;

  @PropertyType([UserProfileRelation])
  userRelations: UserProfileRelation[];

  @PropertyType([UserProfileRelation])
  userOrganizationRelations: UserProfileRelation[];

  @PropertyType([UserProfileRelation])
  profileRelations: UserProfileRelation[];
}
