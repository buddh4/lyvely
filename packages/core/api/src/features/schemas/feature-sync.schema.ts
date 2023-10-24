import { NestedSchema } from '@/core';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { FeatureSyncModel } from '@lyvely/core-interface';

@NestedSchema()
export class FeatureSync extends FeatureSyncModel {
  @Prop()
  updatedAt: number;

  @Prop()
  loadedAt: number;
}

export const FeatureSyncSchema = SchemaFactory.createForClass(FeatureSync);
