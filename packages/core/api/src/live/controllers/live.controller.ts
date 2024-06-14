import { Sse, Req, Param, Query } from '@nestjs/common';
import { type OptionalUserRequest } from '@/users';
import { LiveService } from '../services';
import { GlobalController } from '@/common';

@GlobalController('/live')
export class LiveController {
  constructor(private readonly liveService: LiveService) {}

  @Sse('/user')
  async userUpdates(@Req() request: OptionalUserRequest, @Query('pid') pid?: string) {
    return this.liveService.subscribe(request.user, pid);
  }
}
