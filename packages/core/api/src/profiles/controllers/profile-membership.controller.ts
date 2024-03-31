import {
  Body,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileController, ProfileRoleLevel } from '../decorators';
import { UseClassSerializer } from '@/core';
import {
  API_PROFILE_MEMBERSHIP,
  AvatarModel,
  MembershipModel,
  ProfileMembershipEndpoint,
  ProfileMembershipEndpoints,
  ProfileRelationRole,
  UpdateProfileMembershipSettings,
  UpdateUserRelationsResponse,
  getProfileRelationRole,
} from '@lyvely/interface';
import { ProfileMembershipService } from '../services';
import type { ProfileMembershipRequest } from '../types';
import { UserThrottle, UserThrottlerGuard } from '@/users';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadAvatarPipe } from '@/avatars';

@ProfileController(API_PROFILE_MEMBERSHIP)
@ProfileRoleLevel(ProfileRelationRole.Member)
@UseClassSerializer()
export class ProfileMembershipController implements ProfileMembershipEndpoint {
  constructor(private readonly membershipService: ProfileMembershipService) {}

  @Put()
  async update(
    @Body() update: UpdateProfileMembershipSettings,
    @Req() req: ProfileMembershipRequest,
  ): Promise<MembershipModel> {
    const membership = req.context.getMembership();
    await this.membershipService.updateMembershipInfo(membership, update);
    return new MembershipModel(membership);
  }

  @Delete(ProfileMembershipEndpoints.REVOKE)
  async revoke(@Req() req: ProfileMembershipRequest): Promise<UpdateUserRelationsResponse> {
    const { context, user } = req;
    await this.membershipService.revoke(req.context);
    return new UpdateUserRelationsResponse({
      userRelations: context.relations,
      role: getProfileRelationRole(
        user,
        context.relations,
        context.getOrganizationContext()?.relations,
      ),
    });
  }

  @Put(ProfileMembershipEndpoints.UPDATE_AVATAR)
  @UseGuards(UserThrottlerGuard)
  @UserThrottle(20, 60)
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @UploadedFile(UploadAvatarPipe) file: Express.Multer.File,
    @Req() req: ProfileMembershipRequest,
  ): Promise<AvatarModel> {
    const avatar = await this.membershipService.updateAvatar(req.context, file);
    return new AvatarModel(avatar);
  }

  @Put(ProfileMembershipEndpoints.UPDATE_GAVATAR)
  @UseGuards(UserThrottlerGuard)
  @UserThrottle(20, 60)
  async updateGravatar(@Req() req: ProfileMembershipRequest): Promise<AvatarModel> {
    const avatar = await this.membershipService.updateGravatar(req.context);
    return new AvatarModel(avatar);
  }
}
