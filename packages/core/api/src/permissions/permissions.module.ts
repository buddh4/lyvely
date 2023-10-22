import { LyvelyModule } from '@/core';
import { PERMISSIONS_MODULE_ID } from '@lyvely/core-interface';
import { Global } from '@nestjs/common';
import { GlobalPermissionsService } from './services';

@Global()
@LyvelyModule({
  id: PERMISSIONS_MODULE_ID,
  name: 'Permissions',
  path: __dirname,
  providers: [GlobalPermissionsService],
  exports: [GlobalPermissionsService],
})
export class PermissionsModule {}
