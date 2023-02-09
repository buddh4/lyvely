import { UserPolicyContext } from '@/users';
import { UserCanInvitePolicy } from './user-can-invite.policy';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUserInvitesConfiguration } from '@/user-invites/interfaces/user-invites-configuration.interface';

export class ConfigurationUserCanInvitePolicy extends UserCanInvitePolicy {
  @Inject()
  protected configService: ConfigService;

  async validate(context: UserPolicyContext): Promise<boolean> {
    const inviteConfig = this.configService.get<IUserInvitesConfiguration>(
      'modules.user-invite',
      {},
    );
    const { user } = context.getRequest();
    return user && inviteConfig.allowedHosts?.includes(user.email);
  }
}
