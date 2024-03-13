import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument, type StrictBaseDocumentData, type TObjectId } from '@/core';
import { ProfileMemberGroupModel } from '@lyvely/interface';

@Schema()
export class ProfileMemberGroup implements ProfileMemberGroupModel {
  @Prop()
  name: string;

  @Prop()
  description?: string;

  _id: TObjectId;

  id: string;

  constructor(data: StrictBaseDocumentData<ProfileMemberGroup>) {
    BaseDocument.init(this, data);
  }
}

export const ProfileMemberGroupSchema = SchemaFactory.createForClass(ProfileMemberGroup);
