import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument, NestedSchema, TObjectId } from '@/core';
import { IUserRelationPermissionSetting, UserRelationRole } from '@lyvely/interface';
import { getStringEnumValues } from '@lyvely/common';

@NestedSchema()
export class UserRolePermission
  extends BaseDocument<UserRolePermission>
  implements IUserRelationPermissionSetting<TObjectId>
{
  @Prop({ required: true })
  id: string;

  @Prop({ enum: getStringEnumValues(UserRelationRole), required: true })
  role: UserRelationRole;

  @Prop()
  groups?: TObjectId[];
}

export const UserRolePermissionSchema = SchemaFactory.createForClass(UserRolePermission);
