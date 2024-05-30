import { Profile, IUserWithProfileRelation } from '../schemas';
import { ProfileContext, ProfileContextData } from './profile.context';
import { IUserContext, User } from '@/users';
import { BaseModel } from '@lyvely/common';

/**
 * Represents a profile context for authenticated users, which means it does not support visitors.
 */
export class ProtectedProfileContext<T extends Profile = Profile>
  extends ProfileContext<T>
  implements IUserContext, IUserWithProfileRelation
{
  override user: User;

  constructor(data: ProfileContextData<ProtectedProfileContext<T>>) {
    super(false);
    BaseModel.init(this, data);
  }
}
