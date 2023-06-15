import { NestedSchema } from '@lyvely/server-core';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { FeatureSyncModel } from '@lyvely/common';

@NestedSchema()
export class FeatureSync extends FeatureSyncModel {
  @Prop()
  updatedAt: number;

  @Prop()
  loadedAt: number;
}

export const FeatureSyncSchema = SchemaFactory.createForClass(FeatureSync);
