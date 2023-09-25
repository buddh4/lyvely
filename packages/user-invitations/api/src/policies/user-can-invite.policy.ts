import { UserPolicyContext, UserPolicy } from '@lyvely/users';

export abstract class UserCanInvitePolicy implements UserPolicy {
  abstract validate(context: UserPolicyContext): Promise<boolean>;
}

export const PROVIDER_KEY = UserCanInvitePolicy.name;
