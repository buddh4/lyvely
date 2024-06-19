import { AbstractDao, Dao } from '@/core';
import { UserNotification } from '../schemas';
import { TenancyIsolation } from '@/core/tenancy';

@Dao(UserNotification, { isolation: TenancyIsolation.Strict })
export class UserNotificationDao extends AbstractDao<UserNotification> {}
