import { UserPolicyContext } from '@/users';
import { UserCanInvitePolicy } from './user-can-invite.policy';

export class LaxUserCanInvitePolicy extends UserCanInvitePolicy {
  async validate(context: UserPolicyContext): Promise<boolean> {
    return !!context.getRequest().user;
  }
}
