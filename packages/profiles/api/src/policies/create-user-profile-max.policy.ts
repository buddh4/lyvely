import { Injectable } from '@nestjs/common';
import { IPolicy } from '@lyvely/policies';
import { UserPolicyContext } from '@lyvely/users';

@Injectable()
export class CreateUserProfileLaxPolicy implements IPolicy<UserPolicyContext> {
  async validate(context: UserPolicyContext): Promise<boolean> {
    return !!context.getRequest().user?.isAcitve();
  }
}
