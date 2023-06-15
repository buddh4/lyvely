import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '@lyvely/server-core';

@Exclude()
@Schema({ timestamps: true })
export class RefreshToken extends BaseEntity<RefreshToken> {
  @Prop({ required: true })
  vid: string;

  @Prop({ required: true })
  hash: string;

  @Prop({ required: true })
  expiration: Date;

  @Prop()
  remember?: boolean;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
