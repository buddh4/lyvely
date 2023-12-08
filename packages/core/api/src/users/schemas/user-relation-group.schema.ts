import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument, NestedSchema } from '@/core';
import { UserRelationGroupModel } from '@lyvely/interface';

@NestedSchema()
export class UserRelationGroup
  extends BaseDocument<UserRelationGroup>
  implements UserRelationGroupModel
{
  @Prop({ required: true })
  id: string;

  @Prop()
  name: string;

  @Prop()
  description?: string;
}

export const UserRelationGroupSchema = SchemaFactory.createForClass(UserRelationGroup);
