import { UserPermissionsServiceProvider } from '../interfaces';
import { User, UserStatus } from '@lyvely/users';
import { ConfigService } from '@nestjs/config';
import { ConfigurationPath, assureStringId } from '@lyvely/core';

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