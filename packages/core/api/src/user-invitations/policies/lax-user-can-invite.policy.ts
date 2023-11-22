import { IUserContext } from '@/users';
import { UserStatus } from '@lyvely/interface';
import { UserCanInvitePolicy } from './user-can-invite.policy';

export class LaxUserCanInvitePolicy extends UserCanInvitePolicy {
  async verify(context: IUserContext): Promise<boolean> {
    const user = context.user;
    return user && user.status === UserStatus.Active;
  }
}
