import { Sse, Req, Query, Post } from '@nestjs/common';
import { type OptionalUserRequest } from '@/users';
import { LiveService } from '../services';
import { GlobalController } from '@/common';
import { ProfileEndpoint, ProfileRoleAccess, type ProtectedProfileRequest } from '@/profiles';
import { ProfileRelationRole, LiveEndpoints } from '@lyvely/interface';
import { ContentEndpoint } from '@/content/decorators';
import { type ProtectedProfileContentRequest } from '@/content/types';

@GlobalController('/live')
export class LiveController {
  constructor(private readonly liveService: LiveService) {}

  @Sse(LiveEndpoints.INIT)
  async init(@Req() request: OptionalUserRequest) {
    return this.liveService.subscribeUser(request.user);
  }

  @Post(LiveEndpoints.USER)
  @ProfileRoleAccess(ProfileRelationRole.User)
  async subscribeToUser(
    @Req() request: ProtectedProfileContentRequest,
    @Query('topic') topic?: string
  ) {
    await this.liveService.addUserSubscription(request.user, topic);
  }

  @Post(LiveEndpoints.GLOBAL)
  @ProfileRoleAccess(ProfileRelationRole.User)
  async subscribeToGlobal(
    @Req() request: ProtectedProfileContentRequest,
    @Query('topic') topic?: string
  ) {
    await this.liveService.addGlobalSubscription(request.user, topic);
  }

  @Post(LiveEndpoints.PROFILE(':pid'))
  @ProfileEndpoint()
  @ProfileRoleAccess(ProfileRelationRole.User)
  async subscribeToProfile(
    @Req() request: ProtectedProfileRequest,
    @Query('topic') topic?: string
  ) {
    const { context } = request;
    await this.liveService.addProfileSubscription(context, topic);
  }

  @Post(LiveEndpoints.CONTENT(':pid', ':cid'))
  @ContentEndpoint()
  @ProfileRoleAccess(ProfileRelationRole.User)
  async subscribeToContent(
    @Req() request: ProtectedProfileContentRequest,
    @Query('topic') topic?: string
  ) {
    const { context } = request;
    await this.liveService.addProfileSubscription(context, topic);
  }
}
