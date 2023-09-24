import { IPolicy } from '@lyvely/policies';
import { UserPolicyContext } from '@lyvely/users';

export abstract class CreateUserProfilePolicy implements IPolicy<UserPolicyContext> {
  abstract validate(context: UserPolicyContext): Promise<boolean>;
}

export const PROVIDER_KEY = CreateUserProfilePolicy.name;
