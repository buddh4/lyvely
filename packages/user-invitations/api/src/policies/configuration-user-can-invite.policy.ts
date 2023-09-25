import { UserPolicyContext } from '@lyvely/users';
import { UserCanInvitePolicy } from './user-can-invite.policy';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IInvitationsConfiguration } from '../interfaces';

export class ConfigurationUserCanInvitePolicy extends UserCanInvitePolicy {
  @Inject()
  protected configService: ConfigService;

  async validate(context: UserPolicyContext): Promise<boolean> {
    const inviteConfig = this.configService.get<IInvitationsConfiguration>(
      'modules.user-invite',
      {},
    );
    const { user } = context.getRequest();
    return !!user && !!inviteConfig.allowedHosts?.includes(user.email);
  }
}
