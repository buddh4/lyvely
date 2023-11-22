import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { assureObjectId, assureStringId, ObjectIdProp, TObjectId } from '@/core';
import { BaseModel, PropertiesOf } from '@lyvely/common';
import { UserInfoModel } from '@lyvely/interface';
import { User } from './users.schema';

@Schema({ _id: false })
export class UserInfo
  extends BaseModel<UserInfo>
  implements PropertiesOf<Omit<UserInfoModel, 'uid'>>
{
  @ObjectIdProp({ required: true })
  uid: TObjectId;

  @Prop()
  imageGuid?: string;

  @Prop({ required: true })
  name: string;

  constructor(userOrRelation: User) {
    super({
      uid: assureObjectId(userOrRelation),
      imageGuid: userOrRelation.avatar?.guid || userOrRelation.guid,
      name: userOrRelation.getDisplayName(),
    });
  }

  toModel(): UserInfoModel {
    return new UserInfoModel({
      uid: assureStringId(this.uid),
      imageGuid: this.imageGuid,
      name: this.name,
    });
  }
}

export const UserInfoSchema = SchemaFactory.createForClass(UserInfo);
