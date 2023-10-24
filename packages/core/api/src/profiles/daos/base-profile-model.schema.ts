import { BaseEntity, ObjectIdProp, TObjectId } from '@/core';
import { Prop } from '@nestjs/mongoose';

export class BaseProfileModel<C extends BaseEntity<C>> extends BaseEntity<C> {
  @ObjectIdProp({ required: true })
  oid: TObjectId;

  @Prop({ required: true, default: 'default' })
  location: string;

  @ObjectIdProp({ required: true })
  pid: TObjectId;
}
