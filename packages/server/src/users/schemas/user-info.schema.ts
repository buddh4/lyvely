import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BaseModel, PropertiesOf, UserInfoModel } from '@lyvely/common';
import { assureObjectId, assureStringId } from '@/core';
import { User } from './users.schema';

@Schema({ _id: false })
export class UserInfo
  extends BaseModel<UserInfo>
  implements PropertiesOf<Omit<UserInfoModel, 'uid'>>
{
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
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
