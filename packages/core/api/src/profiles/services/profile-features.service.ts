import { Injectable } from '@nestjs/common';
import { ProfileDao } from '../daos';
import {
  getAffectedFeatures,
  UpdateFeatureModel,
  UpdateFeatureResponseModel,
  getProfileFeature,
  isInstallableProfileFeature,
} from '@lyvely/core-interface';
import { EntityNotFoundException, ForbiddenServiceException } from '@lyvely/common';
import { Profile } from '@/profiles';
import { ConfigService } from '@nestjs/config';
import { ServerConfiguration } from '@/core';

@Injectable()
export class ProfileFeaturesService {
  constructor(
    private profileDao: ProfileDao,
    private configService: ConfigService<ServerConfiguration>,
  ) {}

  async setFeatureState(
    profile: Profile,
    update: UpdateFeatureModel,
  ): Promise<UpdateFeatureResponseModel> {
    const { featureId, state } = update;
    const feature = getProfileFeature(featureId);

    if (!feature) throw new EntityNotFoundException();
    if (!isInstallableProfileFeature(feature.id, profile, this.configService.get('features'))) {
      throw new ForbiddenServiceException();
    }

    const toUpdate = getAffectedFeatures(feature, state).map((feature) => feature.id);

    if (state) {
      const currentState = profile.enabledFeatures || [];
      const enabledFeatures = Array.from(new Set([...toUpdate, ...currentState]));
      const disabledFeatures =
        profile.disabledFeatures?.filter((featureId) => !enabledFeatures.includes(featureId)) || [];
      await this.profileDao.updateOneSetById(profile, { enabledFeatures, disabledFeatures });
    } else {
      const currentState = profile.disabledFeatures || [];
      const disabledFeatures = Array.from(new Set([...toUpdate, ...currentState]));
      const enabledFeatures =
        profile.enabledFeatures?.filter((featureId) => !disabledFeatures.includes(featureId)) || [];
      await this.profileDao.updateOneSetById(profile, { disabledFeatures, enabledFeatures });
    }

    return new UpdateFeatureResponseModel({
      enabled: profile.enabledFeatures,
      disabled: profile.disabledFeatures,
    });
  }
}
