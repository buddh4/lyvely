import { UserPolicyContext } from '../../users';
import { UserPolicy } from '../../users/policies/UserPolicy';
import { UserCanInvitePolicy } from './user-can-invite.policy';

export class LaxUserCanInvitePolicy extends UserCanInvitePolicy {
  async validate(context: UserPolicyContext): Promise<boolean> {
    return true;
  }
}
