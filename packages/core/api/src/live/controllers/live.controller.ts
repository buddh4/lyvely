import { Sse, Req, Query, Post, Res, Logger, Param, Body } from '@nestjs/common';
import { Response } from 'express';
import { type OptionalUserRequest, User } from '@/users';
import { LiveService } from '../services';
import { GlobalController } from '@/common';
import {
  ProfileAccess,
  ProfileRoleAccess,
  ProfilesService,
  type ProtectedProfileRequest,
} from '@/profiles';
import { ProfileRelationRole, LiveEndpoints } from '@lyvely/interface';
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
  async init(@Req() request: OptionalUserRequest, @Res() res: Response) {
    res.on('close', () => {
      // TODO: Clean up state for vid
      this.logger.log(`Closed connection: ${request.user?.id}`);
    });

    return this.liveService.subscribeUser(request.user);
  }

  @Post(LiveEndpoints.RESUME)
  async resumeState(@Req() request: OptionalUserRequest, @Body() state: ILiveSubscriptionState) {
    const subIds = await this.liveService.initUserSubscriptions(request.user);
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
  @ProfileRoleAccess(ProfileRelationRole.User)
  async subscribeToUser(
    @Req() request: ProtectedProfileContentRequest,
    @Query('topic') topic?: string
  ) {
    await this.liveService.addUserSubscription(request.user, topic);
  }

  @Post(LiveEndpoints.UNUSER)
  @ProfileRoleAccess(ProfileRelationRole.User)
  async unsubscribeFromUser(
    @Req() request: ProtectedProfileContentRequest,
    @Query('topic') topic?: string
  ) {
    await this.liveService.removeUserSubscription(request.user, topic);
  }

  @Post(LiveEndpoints.GLOBAL)
  @ProfileRoleAccess(ProfileRelationRole.User)
  async subscribeToGlobal(
    @Req() request: ProtectedProfileContentRequest,
    @Query('topic') topic?: string
  ) {
    await this.liveService.addGlobalSubscription(request.user, topic);
  }

  @Post(LiveEndpoints.UNGLOBAL)
  @ProfileRoleAccess(ProfileRelationRole.User)
  async unsubscribeFromGlobal(
    @Req() request: ProtectedProfileContentRequest,
    @Query('topic') topic?: string
  ) {
    await this.liveService.addGlobalSubscription(request.user, topic);
  }

  @Post(LiveEndpoints.PROFILE(':pid'))
  @ProfileAccess()
  @ProfileRoleAccess(ProfileRelationRole.User)
  async subscribeToProfile(@Req() req: ProtectedProfileRequest, @Query('topic') topic?: string) {
    await this.liveService.addProfileSubscription(req.context, topic);
  }

  @Post(LiveEndpoints.UNPROFILE(':pid'))
  @ProfileRoleAccess(ProfileRelationRole.User)
  async unsubscribeFromProfile(
    @Req() req: ProtectedProfileRequest,
    @Param('pid') pid: string,
    @Query('topic') topic?: string
  ) {
    await this.liveService.removeProfileSubscription(req.user, pid, topic);
  }

  @Post(LiveEndpoints.CONTENT(':pid', ':cid'))
  @ContentAccess()
  @ProfileRoleAccess(ProfileRelationRole.User)
  async subscribeToContent(
    @Req() req: ProtectedProfileContentRequest,
    @Query('topic') topic?: string
  ) {
    await this.liveService.addContentSubscription(req.context, topic);
  }

  @Post(LiveEndpoints.UNCONTENT(':pid', ':cid'))
  @ProfileRoleAccess(ProfileRelationRole.User)
  async subscribeFromContent(
    @Req() req: ProtectedProfileContentRequest,
    @Param('cid') cid: string,
    @Query('topic') topic?: string
  ) {
    await this.liveService.removeContentSubscription(req.user, cid, topic);
  }
}
