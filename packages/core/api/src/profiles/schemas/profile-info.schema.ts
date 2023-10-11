import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BaseModel, PropertiesOf } from '@lyvely/common';
import { ProfileInfoModel } from '@lyvely/core-interface';
import { assureObjectId, assureStringId } from '@/core';
import { Profile } from './profiles.schema';

@Schema({ _id: false })
export class ProfileInfo
  extends BaseModel<ProfileInfo>
  implements PropertiesOf<Omit<ProfileInfoModel, 'pid'>>
{
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  pid: mongoose.Types.ObjectId;

  @Prop()
  imageGuid?: string;

  @Prop({ required: true })
  name: string;

  constructor(profile: Profile) {
    super({
      pid: assureObjectId(profile),
      imageGuid: profile.avatar?.guid,
      name: profile.name,
    });
  }

  toModel(): ProfileInfoModel {
    return new ProfileInfoModel({
      pid: assureStringId(this.pid),
      imageGuid: this.imageGuid,
      name: this.name,
    });
  }
}

export const ProfileInfoSchema = SchemaFactory.createForClass(ProfileInfo);
