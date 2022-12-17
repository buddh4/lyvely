import { NestedSchema } from '@/core';
import { Prop, SchemaFactory } from '@nestjs/mongoose';

@NestedSchema()
export class FeatureSync {
  @Prop({ required: true })
  feature: string;

  @Prop()
  updatedAt: number;

  @Prop()
  seenAt: number;
}

export const FeatureSyncSchema = SchemaFactory.createForClass(FeatureSync);
