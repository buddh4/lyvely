import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import mongoose from 'mongoose';
import { BaseEntity } from '../../core/db/base.entity';

export type RefreshTokenDocument = RefreshToken & mongoose.Document;

@Exclude()
@Schema({ timestamps: true })
export class RefreshToken extends BaseEntity<RefreshToken> {
  @Prop({ required: true })
  vid: string;

  @Prop({ required: true })
  hash: string;

  @Prop({ required: true })
  expiration: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
