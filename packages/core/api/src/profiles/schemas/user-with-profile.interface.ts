import { User } from '@/users';
import { Profile } from './profiles.schema';

export interface IOptionalUserWithProfile {
  profile: Profile;
  user?: User;
}

export interface IUserWithProfile {
  profile: Profile;
  user: User;
}
