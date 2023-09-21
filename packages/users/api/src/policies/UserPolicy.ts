import { IPolicy } from '@lyvely/policies';
import { UserPolicyContext } from '../guards';

export abstract class UserPolicy<T extends UserPolicyContext = UserPolicyContext>
  implements IPolicy<T>
{
  abstract validate(context: T): Promise<boolean>;
}
