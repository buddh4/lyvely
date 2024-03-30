import { Body, Post, Req } from '@nestjs/common';
import { ProfileController, ProfileRoleLevel } from '../decorators';
import { UseClassSerializer } from '@/core';
import {
  API_PROFILE_MEMBERSHIP,
  MembershipModel,
  ProfileMembershipEndpoint,
  ProfileRelationRole,
  UpdateProfileMembershipSettings,
} from '@lyvely/interface';
import { ProfileMembershipService } from '../services';
import type { ProfileMembershipRequest } from '../types';

@ProfileController(API_PROFILE_MEMBERSHIP)
@UseClassSerializer()
export class ProfileMembershipController implements ProfileMembershipEndpoint {
  constructor(private readonly membershipService: ProfileMembershipService) {}

  @Post()
  @ProfileRoleLevel(ProfileRelationRole.Member)
  async update(
    @Body() update: UpdateProfileMembershipSettings,
    @Req() req: ProfileMembershipRequest,
  ): Promise<MembershipModel> {
    const membership = req.context.getMembership();
    await this.membershipService.updateMembershipInfo(membership, update);
    return new MembershipModel(membership);
  }
}
