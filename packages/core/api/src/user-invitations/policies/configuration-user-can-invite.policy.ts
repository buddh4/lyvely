import { IUserContext } from '@/users';
import { UserCanInvitePolicy } from './user-can-invite.policy';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IInvitationsConfiguration } from '../interfaces';

export class ConfigurationUserCanInvitePolicy extends UserCanInvitePolicy {
  @Inject()
  protected configService: ConfigService;

  async verify(context: IUserContext): Promise<boolean> {
    const inviteConfig = this.configService.get<IInvitationsConfiguration>(
      'modules.user-invite',
      {},
    );
    const { user } = context;
    return !!user && !!inviteConfig.allowedHosts?.includes(user.email);
  }
}
