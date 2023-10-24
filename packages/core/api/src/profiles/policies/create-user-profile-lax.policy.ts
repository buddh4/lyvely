import { Injectable } from '@nestjs/common';
import { IUserContext } from '@/users';
import { CreateUserProfilePolicy } from './create-user-profile.policy';

@Injectable()
export class CreateUserProfileLaxPolicy extends CreateUserProfilePolicy {
  async verify(context: IUserContext): Promise<boolean> {
    return !!context.user?.isAcitve();
  }
}
