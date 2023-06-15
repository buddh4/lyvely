import { AbstractDao } from '@lyvely/server-core';
import { UserNotification } from '../schemas';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserNotificationDao extends AbstractDao<UserNotification> {
  @InjectModel(UserNotification.name) protected model: Model<UserNotification>;

  getModelConstructor() {
    return UserNotification;
  }

  getModuleId(): string {
    return 'notifications';
  }
}
