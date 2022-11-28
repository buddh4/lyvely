import { Controller, Sse, Req } from '@nestjs/common';
import { UserRequest } from '@/users';
import { LiveService } from '@/live/services/live.service';

@Controller('/live')
export class LiveController {
  constructor(private readonly liveService: LiveService) {}

  @Sse('/user')
  async userUpdates(@Req() request: UserRequest) {
    return this.liveService.subscribeUser(request.user);
  }
}
