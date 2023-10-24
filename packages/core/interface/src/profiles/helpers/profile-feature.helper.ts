import {
  getAllFeatures,
  getFeature,
  IFeature,
  IFeatureConfig,
  IFeatureConfigDefinition,
  isEnabledGlobalFeature,
} from '@/features';
import { mergeFeatureConfig, IProfileFeatureInfo } from './profile-feature-config.helper';

/**
 * Returns all profile features which are either configurable or installable.
 * @param profile
 * @param config
 */
export function getProfileFeaturesWithSettings(
  profile: IProfileFeatureInfo,
  config: IFeatureConfig,
): IFeature[] {
  const featureDefinition = mergeFeatureConfig(profile, config);
  return getProfileFeatures().filter(
    (feature) => feature.configurable || _isInstallableProfileFeature(feature, featureDefinition),
  );
}

/**
 * Returns all non global features.
 */
export function getProfileFeatures(): IFeature[] {
  return getAllFeatures().filter((feature) => !feature.global);
}

export function isEnabledProfileOrGlobalFeature(
  featureOrId: string | IFeature,
  profile?: IProfileFeatureInfo,
  config: IFeatureConfig = {},
) {
  const feature = getFeature(featureOrId);
  if (!feature) return false;
  return feature.global
    ? isEnabledGlobalFeature(feature, config)
    : isEnabledProfileFeature(featureOrId, profile, config);
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
  profile?: IProfileFeatureInfo,
  config: IFeatureConfig = {},
) {
  if (!profile) return false;
  return _isEnabledProfileFeature(featureOrId, profile, mergeFeatureConfig(profile, config));
}

function _isEnabledProfileFeature(
  featureOrId: string | IFeature,
  profile?: IProfileFeatureInfo,
  featureDefinition: IFeatureConfigDefinition = {},
) {
  if (!profile) return false;
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

/**
 * Searches and returns a registered profile feature by id.
 * @param featureOrId
 */
export function getProfileFeature(featureOrId: string | IFeature) {
  const feature = getFeature(featureOrId);

  // We call getFeature again in case the function was called wit IFeature argument
  if (!feature) {
    console.warn(`Feature '${featureOrId}' is not registered.`);
    return undefined;
  }

  if (feature.global) {
    console.warn(`Global feature ${feature.id} can not be enabled on profiles.`);
    return undefined;
  }

  return feature;
}

/**
 * Checks that the given profile
 *  - exists
 *  - is a profile feature
 *  - is installable
 * @param featureId
 * @param profile
 * @param config
 */
export function isInstallableProfileFeature(
  featureId: string,
  profile: IProfileFeatureInfo,
  config?: IFeatureConfig,
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
