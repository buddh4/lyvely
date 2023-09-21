import { Post, Req, Body } from '@nestjs/common';
import { ProfileController } from '../decorators';
import { ProfileMembershipGuard } from '../guards';
import { ProfileRequest } from '../types';
import { UseClassSerializer } from '@lyvely/core';
import {
  MembershipModel,
  UpdateProfileMembershipSettings,
  ENDPOINT_PROFILE_MEMBERSHIP,
  ProfileMembershipEndpoint,
} from '@lyvely/profiles-interface';
import { ProfileMembershipService } from '../services';

@ProfileController(ENDPOINT_PROFILE_MEMBERSHIP, ProfileMembershipGuard)
@UseClassSerializer()
export class ProfileMembershipController implements ProfileMembershipEndpoint {
  constructor(private readonly membershipService: ProfileMembershipService) {}

  @Post()
  async update(
    @Body() update: UpdateProfileMembershipSettings,
    @Req() req: ProfileRequest,
  ): Promise<MembershipModel> {
    const membership = req.context.getMembership();
    await this.membershipService.updateMembershipInfo(membership, update);
    return new MembershipModel(membership);
  }
}
