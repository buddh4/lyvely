import { Global } from '@nestjs/common';
import { I18n } from './components';
import { LyvelyModule } from '@/core';

@Global()
@LyvelyModule({
  id: 'i18n',
  name: 'i18n',
  path: __dirname,
  description: 'Lyvely i18n module',
  providers: [I18n],
  exports: [I18n],
})
export class I18nModule {}
