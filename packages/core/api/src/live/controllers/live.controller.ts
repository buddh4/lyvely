import { Sse, Req, Query, Post, Res, Logger } from '@nestjs/common';
import { Response } from 'express';
import { type OptionalUserRequest } from '@/users';
import { LiveService } from '../services';
import { GlobalController } from '@/common';
import { ProfileAccess, ProfileRoleAccess, type ProtectedProfileRequest } from '@/profiles';
import { ProfileRelationRole, LiveEndpoints } from '@lyvely/interface';
import { ContentAccess } from '@/content/decorators';
import { type ProtectedProfileContentRequest } from '@/content/types';

@GlobalController('/live')
export class LiveController {
  private readonly logger: Logger = new Logger(LiveController.name);

  constructor(private readonly liveService: LiveService) {}

  @Sse(LiveEndpoints.INIT)
  async init(@Req() request: OptionalUserRequest, @Res() res: Response) {
    res.on('close', () => {
      // TODO: Clean up state for vid
      this.logger.log(`Closed connection: ${request.user?.id}`);
    });

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
  @ProfileAccess()
  @ProfileRoleAccess(ProfileRelationRole.User)
  async subscribeToProfile(
    @Req() request: ProtectedProfileRequest,
    @Query('topic') topic?: string
  ) {
    const { context } = request;
    await this.liveService.addProfileSubscription(context, topic);
  }

  @Post(LiveEndpoints.CONTENT(':pid', ':cid'))
  @ContentAccess()
  @ProfileRoleAccess(ProfileRelationRole.User)
  async subscribeToContent(
    @Req() request: ProtectedProfileContentRequest,
    @Query('topic') topic?: string
  ) {
    const { context } = request;
    await this.liveService.addProfileSubscription(context, topic);
  }
}
