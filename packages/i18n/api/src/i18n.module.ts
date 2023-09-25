import { Module, Global } from '@nestjs/common';
import { I18n } from './components';

@Global()
@Module({
  providers: [I18n],
  exports: [I18n],
})
export class I18nModule {}
