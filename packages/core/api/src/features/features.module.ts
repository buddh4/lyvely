import { Module, Global } from '@nestjs/common';
import { FeatureGuard } from './guards';

@Global()
@Module({
  controllers: [],
  providers: [FeatureGuard],
  exports: [FeatureGuard],
})
export class FeaturesModule {}
