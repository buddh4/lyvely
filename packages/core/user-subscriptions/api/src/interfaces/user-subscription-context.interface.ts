import { User } from '@lyvely/users';
import { Profile, UserProfileRelation } from '@lyvely/profiles';

export interface UserSubscriptionContext {
  user: User;
  profile?: Profile;
  relations?: UserProfileRelation[];
}
