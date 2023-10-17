import {
  getAllFeatures,
  getFeature,
  IFeature,
  IFeatureConfig,
  IFeatureConfigDefinition,
} from '@/features';
import { ProfileModel } from '../models';
import { mergeFeatureConfig } from './profile-feature-config.helper';

export function getProfileFeaturesWithSettings(
  profile: ProfileModel,
  config: IFeatureConfig,
): IFeature[] {
  const result: IFeature[] = [];
  const featureDefinition = mergeFeatureConfig(profile, config);
  for (const feature of getAllFeatures()) {
    if (
      !feature.global &&
      (feature.configurable || _isInstallableProfileFeature(feature, featureDefinition))
    ) {
      result.push(feature);
    }
  }
  return result;
}

/**
 * Checks if a given feature is enabled, respecting the given feature configuration as well as installed profile
 * features and feature defaults and dependent features.
 * @param featureOrId
 * @param profile
 * @param config
 */
export function isEnabledProfileFeature(
  featureOrId: string | IFeature,
  profile: ProfileModel,
  config: IFeatureConfig = {},
) {
  return _isEnabledProfileFeature(featureOrId, profile, mergeFeatureConfig(profile, config));
}

function _isEnabledProfileFeature(
  featureOrId: string | IFeature,
  profile: ProfileModel,
  featureDefinition: IFeatureConfigDefinition,
) {
  const feature = getProfileFeature(featureOrId);

  if (!feature) return false;

  const featureId = feature.id;

  // Check all feature dependencies
  const dependenciesEnabled = !feature.dependencies?.length
    ? true
    : feature.dependencies.reduce(
        (result, dependency) =>
          result && _isEnabledProfileFeature(dependency, profile, featureDefinition),
        true,
      );

  if (!dependenciesEnabled) return false;

  // Check if the feature is explicitly disabled by configuration
  if (
    featureDefinition.disabled?.includes(featureId) &&
    featureDefinition.fixed?.includes(featureId)
  ) {
    return false;
  }

  if (_isInstallableProfileFeature(feature, featureDefinition)) {
    // Check if the feature was manually installed
    if (profile.disabledFeatures?.includes(featureId)) return false;
    if (profile.enabledFeatures?.includes(featureId)) return true;
  }

  // Check if the feature was disabled or enabled by configuration
  if (featureDefinition.disabled?.includes(featureId)) return false;
  if (featureDefinition.enabled?.includes(featureId)) return true;

  // Return default
  return !!feature.enabledByDefault;
}

export function getProfileFeature(featureOrId: string | IFeature) {
  const featureId = typeof featureOrId === 'string' ? featureOrId : featureOrId.id;
  const feature = typeof featureOrId === 'string' ? getFeature(featureId) : featureOrId;

  if (!feature) {
    console.warn(`Feature ${featureId} is not registered.`);
    return null;
  }

  if (feature.global) {
    console.warn(`Global feature ${feature.id} can not be enabled on profiles.`);
    return null;
  }

  return feature;
}

export function isInstallableProfileFeature(
  featureId: string,
  profile: ProfileModel,
  config: IFeatureConfig,
) {
  return _isInstallableProfileFeature(featureId, mergeFeatureConfig(profile, config));
}

function _isInstallableProfileFeature(
  featureOrId: string | IFeature,
  featureDefinition: IFeatureConfigDefinition,
) {
  const feature = getProfileFeature(featureOrId);
  if (!feature || feature.global) return false;
  if (featureDefinition?.nonInstallable?.includes(feature.id)) return false;
  if (featureDefinition?.installable?.includes(feature.id)) return true;

  return !!feature.installable;
}
