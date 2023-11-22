import { Post, Req, Body } from '@nestjs/common';
import { ProfileController } from '../decorators';
import { ProfileRequest } from '../types';
import { UseClassSerializer } from '@/core';
import {
  MembershipModel,
  UpdateProfileMembershipSettings,
  ENDPOINT_PROFILE_MEMBERSHIP,
  ProfileMembershipEndpoint,
} from '@lyvely/interface';
import { ProfileMembershipService } from '../services';

@ProfileController(ENDPOINT_PROFILE_MEMBERSHIP)
@UseClassSerializer()
export class ProfileMembershipController implements ProfileMembershipEndpoint {
  constructor(private readonly membershipService: ProfileMembershipService) {}

  @Post()
  async update(
    @Body() update: UpdateProfileMembershipSettings,
    @Req() req: ProfileRequest,
  ): Promise<MembershipModel> {
    const membership = req.context.getMembership();
    await this.membershipService.updateMembershipInfo(membership!, update);
    return new MembershipModel<any>(membership);
  }
}
