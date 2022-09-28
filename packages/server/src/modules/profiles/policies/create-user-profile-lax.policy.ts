import { Injectable } from '@nestjs/common';
import { IPolicy } from '../../policies/interfaces/policy.interface';
import { UserPolicyContext } from '../../users';

@Injectable()
export class CreateUserProfileLaxPolicy implements IPolicy<UserPolicyContext> {
  async validate(context: UserPolicyContext): Promise<boolean> {
    return !!context.getRequest().user?.isAcitve();
  }
}
