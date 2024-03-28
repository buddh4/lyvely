import { ObjectIdProp, TObjectId } from '@/core';
import { Prop } from '@nestjs/mongoose';

export abstract class ProfileShard {
  @ObjectIdProp({ required: true })
  oid: TObjectId;

  @ObjectIdProp({ required: true })
  pid: TObjectId;

  @Prop({ required: true, default: 'default' })
  location: string;

  _id: TObjectId;

  id: string;
}
