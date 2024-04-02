import { DEFAULT_REGION, ObjectIdProp, TObjectId } from '@/core';
import { Prop } from '@nestjs/mongoose';

export abstract class ProfileShard {
  @ObjectIdProp({ required: true })
  oid: TObjectId;

  @ObjectIdProp({ required: true })
  pid: TObjectId;

  @Prop({ required: true, default: DEFAULT_REGION })
  region: string;

  _id: TObjectId;

  id: string;
}
