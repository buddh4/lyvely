import { Module, Global } from '@nestjs/common';
import { FeatureRegistry } from './components';
import { FeatureGuard } from './guards';

@Global()
@Module({
  controllers: [],
  providers: [FeatureRegistry, FeatureGuard],
  exports: [FeatureRegistry, FeatureGuard],
})
export class FeaturesModule {}
