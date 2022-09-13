import { Policy } from "../../policies/interfaces/policy.interface";
import { UserPolicyContext } from "../../users";

export abstract class CreateUserProfilePolicy implements Policy<UserPolicyContext> {
  abstract validate(context: UserPolicyContext): Promise<boolean>;
}

export const PROVIDER_KEY = CreateUserProfilePolicy.name;
