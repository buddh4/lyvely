import { ProfileController } from '../decorators';
import { Request, Post, Body, Inject } from '@nestjs/common';
import { ProfileRequest } from '../types';
import { UseClassSerializer } from '@/core';
import {
  UpdateFeatureModel,
  UpdateFeatureResponseModel,
  API_PROFILE_FEATURES,
  ProfileFeaturesEndpoint,
} from '@lyvely/interface';
import { ProfileFeaturesService } from '../services';

@ProfileController(API_PROFILE_FEATURES)
@UseClassSerializer()
export class ProfileFeaturesController implements ProfileFeaturesEndpoint {
  @Inject()
  private profileFeaturesService: ProfileFeaturesService;

  @Post()
  async updateState(
    @Body() update: UpdateFeatureModel,
    @Request() req: ProfileRequest
  ): Promise<UpdateFeatureResponseModel> {
    return this.profileFeaturesService.setFeatureState(req.profile, update);
  }
}
