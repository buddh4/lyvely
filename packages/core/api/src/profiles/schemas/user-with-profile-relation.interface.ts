import { User } from '@/users';
import { Profile } from './profiles.schema';
import { UserProfileRelation } from './user-profile-relations.schema';

export interface IUserWithProfileRelation {
  profile: Profile;
  user: User;
  relations: UserProfileRelation[];
}
