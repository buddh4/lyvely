import { BaseDocument, ObjectIdProp, TObjectId } from '@/core';
import { Prop } from '@nestjs/mongoose';

export class BaseProfileModel<C extends BaseDocument<C>> extends BaseDocument<C> {
  @ObjectIdProp({ required: true })
  oid: TObjectId;

  @Prop({ required: true, default: 'default' })
  location: string;

  @ObjectIdProp({ required: true })
  pid: TObjectId;
}
