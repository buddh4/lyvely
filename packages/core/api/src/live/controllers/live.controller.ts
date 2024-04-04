import { Sse, Req, Param } from '@nestjs/common';
import { UserRequest } from '@/users';
import { LiveService } from '../services';
import { GlobalController } from '@/common';

@GlobalController('/live')
export class LiveController {
  constructor(private readonly liveService: LiveService) {}

  @Sse('/user')
  async userUpdates(@Req() request: UserRequest) {
    return this.liveService.subscribeUser(request.user);
  }

  @Sse('/:pid/guest')
  async profileUpdates(@Param('pid') pid, @Req() request: UserRequest) {
    return this.liveService.subscribeGuest(request.user, pid);
  }
}
