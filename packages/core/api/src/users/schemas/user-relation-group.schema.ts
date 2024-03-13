import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { NestedSchema } from '@/core';
import { UserRelationGroupModel } from '@lyvely/interface';
import { BaseModel, type BaseModelData } from '@lyvely/common';

@NestedSchema()
export class UserRelationGroup implements UserRelationGroupModel {
  @Prop({ required: true })
  id: string;

  @Prop()
  name: string;

  @Prop()
  description?: string;

  constructor(data: BaseModelData<UserRelationGroup>) {
    BaseModel.init(this, data);
  }
}

export const UserRelationGroupSchema = SchemaFactory.createForClass(UserRelationGroup);
