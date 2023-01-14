import { Exclude, Expose } from 'class-transformer';
import { BaseModel, PropertyType } from '@/models';

@Exclude()
export class UserNotificationStateModel extends BaseModel<UserNotificationStateModel> {
  @Expose()
  @PropertyType(Boolean, { default: false })
  updatesAvailable: boolean;
}