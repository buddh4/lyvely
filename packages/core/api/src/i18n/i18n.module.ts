import { Global } from '@nestjs/common';
import { I18n } from './components';
import { LyvelyModule } from '@/core';
import { I18N_MODULE_ID } from '@lyvely/core-interface';
import { I18nEvents } from './i18n.events';

@Global()
@LyvelyModule({
  id: I18N_MODULE_ID,
  name: 'I18n',
  path: __dirname,
  description: 'Lyvely i18n module',
  providers: [I18n, I18nEvents],
  exports: [I18n],
})
export class I18nModule {}
