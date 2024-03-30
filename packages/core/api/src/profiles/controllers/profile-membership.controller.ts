import { Body, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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

  @Post()
  async update(
    @Body() update: UpdateProfileMembershipSettings,
    @Req() req: ProfileMembershipRequest,
  ): Promise<MembershipModel> {
    const membership = req.context.getMembership();
    await this.membershipService.updateMembershipInfo(membership, update);
    return new MembershipModel(membership);
  }

  @Post(ProfileMembershipEndpoints.UPDATE_AVATAR)
  @UseGuards(UserThrottlerGuard)
  @UserThrottle(20, 60)
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @UploadedFile(UploadAvatarPipe) file: Express.Multer.File,
    @Req() req: ProfileMembershipRequest,
  ) {
    const avatar = await this.membershipService.updateAvatar(req.context, file);
    return new AvatarModel(avatar);
  }

  @Post(ProfileMembershipEndpoints.UPDATE_GAVATAR)
  @UseGuards(UserThrottlerGuard)
  @UserThrottle(20, 60)
  async updateGravatar(@Req() req: ProfileMembershipRequest) {
    const avatar = await this.membershipService.updateGravatar(req.context);
    return new AvatarModel(avatar);
  }
}
