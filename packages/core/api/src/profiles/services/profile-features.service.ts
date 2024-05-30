import { Injectable } from '@nestjs/common';
import { ProfileDao } from '../daos';
import {
  getAffectedFeatures,
  UpdateFeatureModel,
  UpdateFeatureResponseModel,
  getProfileFeature,
  isInstallableProfileFeature,
  DocumentNotFoundException,
  ForbiddenServiceException,
  isEnabledProfileFeature,
} from '@lyvely/interface';
import { Profile } from '../schemas';
import { ConfigService } from '@nestjs/config';
import { ServerConfiguration } from '@/config';

/**
 * A service for managing profile level features.
 * @constructor
 * @param {ProfileDao} profileDao - The profile DAO to access profile data.
 * @param {ConfigService<ServerConfiguration>} configService - The service for retrieving server configuration.
 */
@Injectable()
export class ProfileFeaturesService {
  constructor(
    private profileDao: ProfileDao,
    private configService: ConfigService<ServerConfiguration>
  ) {}

  /**
   * Determines if a specific feature is enabled for a given profile.
   *
   * @param {Profile} profile - The profile object.
   * @param {string} featureId - The ID of the feature to check.
   * @return {Promise<boolean>} - A promise that resolves to a boolean indicating if the feature is enabled.
   */
  isFeaturesEnabled(profile: Profile, featureId: string): boolean {
    return isEnabledProfileFeature(featureId, profile, this.configService.get('features', {}));
  }

  /**
   * Sets the state of a feature for a given profile.
   *
   * @param {Profile} profile - The profile to update.
   * @param {UpdateFeatureModel} update - The update object containing the featureId and state.
   * @returns {Promise<UpdateFeatureResponseModel>} - The response model containing the updated enabled and disabled features.
   * @throws {DocumentNotFoundException} - If the feature is not found.
   * @throws {ForbiddenServiceException} - If the feature cannot be installed for the profile.
   */
  async setFeatureState(
    profile: Profile,
    update: UpdateFeatureModel
  ): Promise<UpdateFeatureResponseModel> {
    const { featureId, state } = update;
    const feature = getProfileFeature(featureId);

    if (!feature) throw new DocumentNotFoundException();
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
