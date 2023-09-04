import { Module, Global } from '@nestjs/common';
import { UrlGenerator } from './services';

@Global()
@Module({
  controllers: [],
  providers: [UrlGenerator],
  exports: [UrlGenerator],
})
export class CoreModule {}
