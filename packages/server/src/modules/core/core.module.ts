import { Module, Global } from '@nestjs/common';
import { FeatureRegistry, FeatureGuard } from './features';
import { UrlGenerator } from './services';

@Global()
@Module({
  controllers: [],
  providers: [FeatureRegistry, FeatureGuard, UrlGenerator],
  exports: [FeatureRegistry, FeatureGuard, UrlGenerator],
})
export class CoreModule {}
