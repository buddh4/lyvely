import {
  FeatureType,
  getAllFeatures,
  getFeature,
  IFeature,
  IFeatureConfig,
  IFeatureConfigDefinition,
  type IGlobalFeature,
  type IProfileFeature,
  isEnabledGlobalFeature,
} from '@/features';
import { mergeFeatureConfig } from './profile-feature-config.helper';
import type { IProfileFeatureInfo } from '@/profiles/interfaces';

/**
 * Returns all profile features which are either configurable or installable.
 * @param profile
 * @param config
 */
export function getProfileFeaturesWithSettings(
  profile: IProfileFeatureInfo,
  config: IFeatureConfig
): IFeature[] {
  const featureDefinition = mergeFeatureConfig(profile, config);
  return getProfileFeatures().filter(
    (feature) => feature.configurable || _isInstallableProfileFeature(feature, featureDefinition)
  );
}

/**
 * Returns all non profile features.
 */
export function getProfileFeatures(): IProfileFeature[] {
  return getAllFeatures().filter(isProfileFeature);
}

/**
 * Checks if the given feature is a profile feature.
 *
 * @param {IFeature} feature - The feature to check.
 * @return {boolean} - Returns true if the feature is a profile feature, false otherwise.
 */
export function isProfileFeature(feature?: IFeature): feature is IProfileFeature {
  return feature?.type === FeatureType.Profile;
}

/**
 * Determines whether a feature is enabled, this helper can be used for profile and global features.
 *
 * @param {string | IFeature} featureOrId - The feature or its ID.
 * @param {IProfileFeatureInfo} [profile] - The profile feature information.
 * @param {IFeatureConfig} [config={}] - The feature configuration.
 * @returns {boolean} - `true` if the feature is enabled, `false` otherwise.
 */
export function isEnabledFeature(
  featureOrId: string | IFeature,
  profile?: IProfileFeatureInfo,
  config: IFeatureConfig = {}
) {
  const feature = getFeature(featureOrId);

  if (!feature) return false;
  switch (feature.type) {
    case FeatureType.Global:
      return isEnabledGlobalFeature(feature as IGlobalFeature, config);
    case FeatureType.Profile:
      return isEnabledProfileFeature(feature as IProfileFeature, profile, config);
  }
}

/**
 * Checks if a given feature is enabled, respecting the given feature configuration as well as installed profile
 * features and feature defaults and dependent features.
 * @param featureOrId
 * @param profile
 * @param config
 */
export function isEnabledProfileFeature(
  featureOrId: string | IProfileFeature,
  profile?: IProfileFeatureInfo,
  config: IFeatureConfig = {}
) {
  if (!profile) return false;
  return _isEnabledProfileFeature(featureOrId, profile, mergeFeatureConfig(profile, config));
}

function _isEnabledProfileFeature(
  featureOrId: string | IProfileFeature,
  profile?: IProfileFeatureInfo,
  featureDefinition: IFeatureConfigDefinition = {}
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
        true
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
export function getProfileFeature(featureOrId: string | IFeature): IProfileFeature | undefined {
  const feature = getFeature(featureOrId);

  // We call getFeature again in case the function was called wit IFeature argument
  if (!feature) {
    console.warn(`Feature '${featureOrId}' is not registered.`);
    return undefined;
  }

  if (!isProfileFeature(feature)) {
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
  config?: IFeatureConfig
) {
  return _isInstallableProfileFeature(featureId, mergeFeatureConfig(profile, config));
}

function _isInstallableProfileFeature(
  featureOrId: string | IFeature,
  featureDefinition: IFeatureConfigDefinition
) {
  const feature = getProfileFeature(featureOrId);
  if (!isProfileFeature(feature)) return false;
  if (featureDefinition?.nonInstallable?.includes(feature.id)) return false;
  if (featureDefinition?.installable?.includes(feature.id)) return true;

  return !!feature.installable;
}

/**
 * Creates a profile feature definition with the following defaults:
 *
 * - name: <moduleId>.features.<id>.name
 * - description: <moduleId>.features.<id>.description
 * - installable: true
 * - enabledByDefault: true
 * - configurable: false
 *
 * @param {string} id - The id of the profile feature.
 * @param {string} moduleId - The id of the module to which the profile feature belongs.
 * @param {Partial<Omit<IProfileFeature, 'id' | 'moduleId' | 'type'>>} [options] - Optional parameters to customize the feature.
 *
 * @return {IProfileFeature} - The created profile feature object.
 */
export function createProfileFeature(
  id: string,
  moduleId: string,
  options?: Partial<Omit<IProfileFeature, 'id' | 'moduleId' | 'type'>>
) {
  return {
    name: `${moduleId.toLowerCase()}.features.${id.toString()}.name`,
    description: `${moduleId.toLowerCase()}.features.${id.toString()}.description`,
    installable: true,
    enabledByDefault: true,
    configurable: false,
    ...options,
    type: FeatureType.Profile,
    moduleId,
    id,
  } satisfies IProfileFeature;
}
