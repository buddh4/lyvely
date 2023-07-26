import { IPolicy } from '../../policies/interfaces/policy.interface';
import { UserPolicyContext } from '../guards';

export abstract class UserPolicy<T extends UserPolicyContext = UserPolicyContext> implements IPolicy<T> {
  abstract validate(context: T): Promise<boolean>;
}
