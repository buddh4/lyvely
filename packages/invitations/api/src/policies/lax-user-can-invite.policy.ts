import { UserPolicyContext } from '@lyvely/users';
import { UserCanInvitePolicy } from './user-can-invite.policy';
import { UserStatus } from '@lyvely/common';

export class LaxUserCanInvitePolicy extends UserCanInvitePolicy {
  async validate(context: UserPolicyContext): Promise<boolean> {
    const user = context.getRequest().user;
    return user && user.status === UserStatus.Active;
  }
}
