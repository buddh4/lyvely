import { IPolicy } from '../../policies/interfaces/policy.interface';
import { UserPolicyContext } from '../../users';

export abstract class CreateUserProfilePolicy implements IPolicy<UserPolicyContext> {
  abstract validate(context: UserPolicyContext): Promise<boolean>;
}

export const PROVIDER_KEY = CreateUserProfilePolicy.name;
