import { Exclude, Expose } from 'class-transformer';
import { BaseModel, type PropertiesOf, PropertyType } from '@lyvely/common';

@Exclude()
export class UserNotificationStateModel {
  @Expose()
  @PropertyType(Boolean, { default: false })
  updatesAvailable: boolean;

  constructor(data: PropertiesOf<UserNotificationStateModel>) {
    BaseModel.init(this, data);
  }
}
