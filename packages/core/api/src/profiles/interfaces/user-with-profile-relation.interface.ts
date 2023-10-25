import { User } from '@/users';
import { Profile, UserProfileRelation } from '../schemas';

export interface IUserWithProfileRelation {
  profile: Profile;
  user: User;
  relations: UserProfileRelation[];
}
