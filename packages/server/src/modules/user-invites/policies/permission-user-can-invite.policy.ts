import { UserPolicyContext } from '../../users';
import { ConfigService } from '@nestjs/config';
import { UserCanInvitePolicy } from './user-can-invite.policy';

export class PermissionUserCanInvitePolicy extends UserCanInvitePolicy {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  async validate(context: UserPolicyContext): Promise<boolean> {
    return true;
  }
}
