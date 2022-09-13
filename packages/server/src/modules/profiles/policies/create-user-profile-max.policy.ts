import { Injectable } from '@nestjs/common';
import { Policy } from "../../policies/interfaces/policy.interface";
import { UserPolicyContext } from "../../users";

@Injectable()
export class CreateUserProfileLaxPolicy implements Policy<UserPolicyContext> {
  async validate(context: UserPolicyContext): Promise<boolean> {
    return !!context.getRequest().user?.isAcitve();
  }
}
