import { Module, Global } from '@nestjs/common';
import { I18nService } from './services/i18n.service';

@Global()
@Module({
  providers: [I18nService],
  exports: [I18nService],
})
export class I18nModule {}
