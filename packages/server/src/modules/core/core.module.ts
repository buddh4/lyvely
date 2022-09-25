import { Module, Global } from '@nestjs/common';
import { FeatureRegistry } from './features/feature.registry';
import { FeatureGuard } from './features/feature.guard';
import { UrlGenerator } from "./services/url-generator.service";

@Global()
@Module({
  controllers: [],
  providers: [
    FeatureRegistry,
    FeatureGuard,
    UrlGenerator
  ],
  exports: [
    FeatureRegistry
  ]
})
export class CoreModule {}
