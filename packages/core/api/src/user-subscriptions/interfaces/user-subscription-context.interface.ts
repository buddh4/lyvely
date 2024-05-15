import { User } from '@/users';
import { Profile, UserProfileRelation } from '@/profiles';

export interface IUserSubscriptionContext {
  user: User;
  profile?: Profile;
  profileRelations?: UserProfileRelation[];
}
