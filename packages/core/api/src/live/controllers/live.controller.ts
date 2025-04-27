import { Sse, Req, Query, Post, Res, Logger, Param, Body } from '@nestjs/common';
import { Response } from 'express';
import { type OptionalUserRequest, User, UserRequest, UserRoleAccess } from '@/users';
import { LiveService } from '../services';
import { GlobalController } from '@/common';
import {
  ProfileAccess,
  ProfilesService,
  type ProtectedProfileRequest,
} from '@/profiles';
import { LiveEndpoints, UserRole } from '@lyvely/interface';
import { ContentAccess } from '@/content/decorators';
import { type ProtectedProfileContentRequest } from '@/content/types';
import type { ILiveSubscriptionState } from '@lyvely/interface';
import { ContentService } from '@/content/services';
import { ProtectedProfileContentContext } from '@/content/schemas';

@GlobalController('/live')
export class LiveController {
  private readonly logger: Logger = new Logger(LiveController.name);

  constructor(
    private readonly liveService: LiveService,
    private readonly profilesService: ProfilesService,
    private readonly contentService: ContentService
  ) {}

  @Sse(LiveEndpoints.INIT)
  async init(
    @Req() request: OptionalUserRequest,
    @Res() res: Response,
    @Query('connectId') connectId: string
  ) {
    res.on('close', () => {
      this.liveService.disconnect(request.user, connectId);
    });
    return this.liveService.subscribeClient(request.user, connectId);
  }

  /**
   * Currently not in use, but maybe helpful in the future...
   * @param request
   * @param state
   * @param connectId
   */
  //@Post(LiveEndpoints.RESUME)
  async resumeState(
    @Req() request: OptionalUserRequest,
    @Body() state: ILiveSubscriptionState,
    @Query('connectId') connectId: string
  ) {
    const subIds = await this.liveService.initClientSubscriptions(request.user, connectId);
    for (const subId of state.subIds) {
      const subIdParts = subId.split(':');
      switch (subIdParts[0]) {
        case 'user':
          if (!request.user || !subIdParts[1]) continue;
          await this.liveService.addUserSubscription(request.user, subIdParts[1]);
          break;
        case 'global':
          if (!request.user || !subIdParts[1]) continue;
          await this.liveService.addGlobalSubscription(request.user, subIdParts[1]);
          break;
        case 'profile':
          // TODO: Add guest support
          if (!request.user || subIds?.includes(subId)) continue;
          await this.liveService.addProfileSubscription(
            await this.profilesService.findProfileContext(request.user, subIdParts[1]),
            subIdParts[2]
          );
          break;
        case 'content':
          // TODO: Add guest support
          if (!request.user || subIds?.includes(subId)) continue;
          await this.addContentSubscription(request.user, subIdParts);
      }
    }
  }

  async addContentSubscription(user: User, subIdParts: string[]) {
    const profileContext = await this.profilesService.findProfileContext(user, subIdParts[1]);
    const content = await this.contentService.findById(profileContext, subIdParts[2]);
    if (!content) return;
    await this.liveService.addContentSubscription(
      new ProtectedProfileContentContext({ ...profileContext, content }),
      subIdParts[3]
    );
  }

  @Post(LiveEndpoints.USER)
  @UserRoleAccess(UserRole.User)
  async subscribeToUser(
    @Req() request: UserRequest,
    @Query('connectId') connectId: string,
    @Query('topic') topic?: string
  ) {
    await this.liveService.addUserSubscription(request.user, connectId, topic);
  }

  @Post(LiveEndpoints.UNUSER)
  @UserRoleAccess(UserRole.User)
  async unsubscribeFromUser(
    @Req() request: UserRequest,
    @Query('connectId') connectId: string,
    @Query('topic') topic?: string
  ) {
    await this.liveService.removeUserSubscription(request.user, connectId, topic);
  }

  @Post(LiveEndpoints.GLOBAL)
  async subscribeToGlobal(
    @Req() request: ProtectedProfileContentRequest,
    @Query('connectId') connectId: string,
    @Query('topic') topic?: string
  ) {
    await this.liveService.addGlobalSubscription(request.user, connectId, topic);
  }

  @Post(LiveEndpoints.UNGLOBAL)
  async unsubscribeFromGlobal(
    @Req() request: ProtectedProfileContentRequest,
    @Query('connectId') connectId: string,
    @Query('topic') topic?: string
  ) {
    await this.liveService.addGlobalSubscription(request.user, connectId, topic);
  }

  @Post(LiveEndpoints.PROFILE(':pid'))
  @ProfileAccess()
  async subscribeToProfile(
    @Req() req: ProtectedProfileRequest,
    @Query('connectId') connectId: string,
    @Query('topic') topic?: string
  ) {
    await this.liveService.addProfileSubscription(req.context, connectId, topic);
  }

  @Post(LiveEndpoints.UNPROFILE(':pid'))
  async unsubscribeFromProfile(
    @Req() req: ProtectedProfileRequest,
    @Param('pid') pid: string,
    @Query('connectId') connectId: string,
    @Query('topic') topic?: string
  ) {
    await this.liveService.removeProfileSubscription(req.user, pid, connectId, topic);
  }

  @Post(LiveEndpoints.CONTENT(':pid', ':cid'))
  @ContentAccess()
  async subscribeToContent(
    @Req() req: ProtectedProfileContentRequest,
    @Query('connectId') connectId: string,
    @Query('topic') topic?: string
  ) {
    await this.liveService.addContentSubscription(req.context, connectId, topic);
  }

  @Post(LiveEndpoints.UNCONTENT(':pid', ':cid'))
  async subscribeFromContent(
    @Req() req: ProtectedProfileContentRequest,
    @Param('cid') cid: string,
    @Query('connectId') connectId: string,
    @Query('topic') topic?: string
  ) {
    await this.liveService.removeContentSubscription(req.user, cid, connectId, topic);
  }
}
