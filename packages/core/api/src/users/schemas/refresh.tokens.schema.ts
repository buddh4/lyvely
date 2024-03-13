import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { BaseDocument, type StrictBaseDocumentData, type TObjectId } from '@/core';

@Exclude()
@Schema({ timestamps: true })
export class RefreshToken {
  @Prop({ required: true })
  vid: string;

  @Prop({ required: true })
  hash: string;

  @Prop({ required: true })
  expiration: Date;

  @Prop()
  remember?: boolean;

  id: string;

  _id: TObjectId;

  constructor(data: StrictBaseDocumentData<RefreshToken>) {
    BaseDocument.init(this, data);
  }
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
