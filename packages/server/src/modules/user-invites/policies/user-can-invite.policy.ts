import { UserPolicyContext } from "../../users";
import { UserPolicy } from "../../users/policies/UserPolicy";

export abstract class UserCanInvitePolicy implements UserPolicy {
  abstract validate(context: UserPolicyContext): Promise<boolean>;
}

export const PROVIDER_KEY = UserCanInvitePolicy.name;
