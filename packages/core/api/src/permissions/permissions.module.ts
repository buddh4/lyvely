import { LyvelyModule } from '@/core';
import { PERMISSIONS_MODULE_ID } from '@lyvely/interface';
import { Global } from '@nestjs/common';
import { GlobalPermissionsService } from './services';
import { PermissionEvents } from './permission.events';

@Global()
@LyvelyModule({
  id: PERMISSIONS_MODULE_ID,
  name: 'Permissions',
  path: __dirname,
  providers: [GlobalPermissionsService, PermissionEvents],
  exports: [GlobalPermissionsService],
})
export class PermissionsModule {}
