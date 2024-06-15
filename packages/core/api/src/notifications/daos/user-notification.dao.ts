import { AbstractDao, Dao } from '@/core';
import { UserNotification } from '../schemas';

@Dao(UserNotification)
export class UserNotificationDao extends AbstractDao<UserNotification> {}
