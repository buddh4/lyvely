import { Post, Req, Body } from '@nestjs/common';
import { ProfileController } from '../decorators';
import { ProfileMembershipGuard } from '../guards';
import { ProfileRequest } from '../types';
import { UseClassSerializer } from '@lyvely/core';
import {
  MembershipModel,
  UpdateProfileMembershipSettingsDto,
  ENDPOINT_PROFILE_MEMBERSHIP,
  ProfileMembershipEndpoint,
} from '@lyvely/common';
import { ProfileMembershipService } from '@/profiles/services/profile-membership.service';

@ProfileController(ENDPOINT_PROFILE_MEMBERSHIP, ProfileMembershipGuard)
@UseClassSerializer()
export class ProfileMembershipController implements ProfileMembershipEndpoint {
  constructor(private readonly membershipService: ProfileMembershipService) {}

  @Post()
  async update(
    @Body() update: UpdateProfileMembershipSettingsDto,
    @Req() req: ProfileRequest,
  ): Promise<MembershipModel> {
    const membership = req.context.getMembership();
    await this.membershipService.updateMembershipInfo(membership, update);
    return new MembershipModel(membership);
  }
}
