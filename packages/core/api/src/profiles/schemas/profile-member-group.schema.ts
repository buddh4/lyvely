import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument } from '@/core';
import { ProfileMemberGroupModel } from '@lyvely/interface';

@Schema()
export class ProfileMemberGroup
  extends BaseDocument<ProfileMemberGroup>
  implements ProfileMemberGroupModel
{
  @Prop()
  name: string;

  @Prop()
  description?: string;
}

export const ProfileMemberGroupSchema = SchemaFactory.createForClass(ProfileMemberGroup);
