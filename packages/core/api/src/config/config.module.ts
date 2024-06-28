import { CoreModule, LyvelyModule } from '@/core';
import { MODULE_ID_CONFIG } from './config.constants';
import { LyvelyConfigService } from './services';
import { Global } from '@nestjs/common';

@Global()
@LyvelyModule({
  id: MODULE_ID_CONFIG,
  path: __dirname,
  imports: [CoreModule],
  providers: [LyvelyConfigService],
  exports: [LyvelyConfigService],
})
export class LyvelyConfigModule {}
