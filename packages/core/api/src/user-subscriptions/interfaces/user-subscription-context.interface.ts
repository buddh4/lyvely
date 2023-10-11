import { User } from '@/users';
import { Profile, UserProfileRelation } from '@/profiles';

export interface UserSubscriptionContext {
  user: User;
  profile?: Profile;
  relations?: UserProfileRelation[];
}
