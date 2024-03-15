import { BaseDocument, ObjectIdProp, type StrictBaseDocumentData, TObjectId } from '@/core';
import { Prop } from '@nestjs/mongoose';

export abstract class ProfileDocument {
  @ObjectIdProp({ required: true })
  oid: TObjectId;

  @Prop({ required: true, default: 'default' })
  location: string;

  @ObjectIdProp({ required: true })
  pid: TObjectId;

  _id: TObjectId;

  id: string;
}
