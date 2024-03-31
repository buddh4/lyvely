import { AvatarsController } from './controllers';
import { LyvelyModule } from '../core';
import { AVATARS_MODULE_ID } from '@lyvely/interface';
import { AvatarService, GravatarService } from './services';

@LyvelyModule({
  id: AVATARS_MODULE_ID,
  path: __dirname,
  controllers: [AvatarsController],
  providers: [AvatarService, GravatarService],
  exports: [AvatarService, GravatarService],
})
export class AvatarsModule {}
