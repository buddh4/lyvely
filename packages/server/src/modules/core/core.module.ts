import { Module } from '@nestjs/common';
import { FeatureRegistry } from './features/feature.registry';
import { FeatureGuard } from './features/feature.guard';

@Module({
  controllers: [],
  providers: [
    FeatureRegistry,
    FeatureGuard
  ],
  exports: [
    FeatureRegistry
  ]
})
export class CoreModule {}
