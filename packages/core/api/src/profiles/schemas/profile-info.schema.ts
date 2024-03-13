import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PropertiesOf } from '@lyvely/common';
import { ProfileInfoModel } from '@lyvely/interface';
import { assureObjectId, assureStringId, ObjectIdProp, TObjectId } from '@/core';
import { Profile } from './profiles.schema';

@Schema({ _id: false })
export class ProfileInfo implements PropertiesOf<Omit<ProfileInfoModel, 'pid'>> {
  @ObjectIdProp({ required: true })
  pid: TObjectId;

  @Prop()
  imageGuid?: string;

  @Prop({ required: true })
  name: string;

  constructor(profile: Profile) {
    this.pid = assureObjectId(profile);
    this.imageGuid = profile.avatar?.guid;
    this.name = profile.name;
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
