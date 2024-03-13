import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { NestedSchema, TObjectId } from '@/core';
import { IUserRelationPermissionSetting, UserRelationRole } from '@lyvely/interface';
import { BaseModel, type BaseModelData, getStringEnumValues } from '@lyvely/common';

@NestedSchema()
export class UserRolePermission implements IUserRelationPermissionSetting<TObjectId> {
  // TODO: this should not be a base document
  @Prop({ required: true })
  id: string;

  @Prop({ enum: getStringEnumValues(UserRelationRole), required: true })
  role: UserRelationRole;

  @Prop()
  groups?: TObjectId[];

  constructor(data: BaseModelData<UserRolePermission>) {
    BaseModel.init(this, data);
  }
}

export const UserRolePermissionSchema = SchemaFactory.createForClass(UserRolePermission);
