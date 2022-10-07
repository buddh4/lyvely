import { UserPermissionsServiceProvider } from '../interfaces';
import { User } from '../../users';
import { ConfigService } from '@nestjs/config';
import { ConfigurationPath } from '@/modules/app-config';
import { UserStatus } from '@lyvely/common';
import { assureStringId } from '@/modules/core';

export class ConfigUserPermissionsService extends UserPermissionsServiceProvider {
  constructor(private readonly configService: ConfigService<ConfigurationPath>) {
    super();
  }

  async checkPermission(user: User, permission: string): Promise<boolean> {
    if (user.status !== UserStatus.Active) return false;

    const permissionConfig = this.configService.get('user-permissions');

    if (!permissionConfig) return false;

    const userIds = permissionConfig[permission] || [];

    return userIds.includes(assureStringId(user));
  }
}
