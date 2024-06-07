import { IFeature, IFeatureConfig, type IGlobalFeature } from './interfaces';
import { getAllFeatures, getFeature, isGlobalFeature } from './feature.registry';

/**
 * Checks whether a given global feature is enabled.
 *
 * @param {string | IGlobalFeature} featureOrId - The feature or feature ID to check.
 * @param {IFeatureConfig} config - The configuration object.
 * @returns {boolean} - Returns true if the global feature is enabled, false otherwise.
 */
export const isEnabledGlobalFeature = (
  featureOrId: string | IGlobalFeature,
  config: IFeatureConfig = {}
) => {
  const feature = getFeature(featureOrId);

  if (!isGlobalFeature(feature)) return false;

  const featureId = feature.id;

  const featureDefinition = config.global || {};

  // Check all feature dependencies
  const dependenciesEnabled = !feature.dependencies?.length
    ? true
    : feature.dependencies.reduce(
        (result, dependency) => result && isEnabledGlobalFeature(dependency, config),
        true
      );

  if (!dependenciesEnabled) return false;

  // Check if the feature was disabled or enabled by configuration
  if (featureDefinition.disabled?.includes(featureId)) return false;
  if (featureDefinition.enabled?.includes(featureId)) return true;

  // Return default
  return !!feature.enabledByDefault;
};

/**
 * Checks if the given feature has any sub features within the given alLFeatures array or within all registered features
 * if allFeatures was not set.
 * @param featureOrId
 * @param allFeatures
 */
export const hasSubFeatures = (featureOrId: string | IFeature, allFeatures?: IFeature[]) => {
  return !!getSubFeatures(featureOrId, allFeatures).length;
};

/**
 * Gets all sub features of the given features within the given allFeatures or all registered features if no allFeatures
 * was not set.
 * @param featureOrId
 * @param allFeatures
 */
export const getSubFeatures = (featureOrId: string | IFeature, allFeatures?: IFeature[]) => {
  const feature = getFeature(featureOrId);
  if (!feature) return [];
  allFeatures ||= getAllFeatures();
  return allFeatures.filter((testFeature) => hasDependency(testFeature, feature.id));
};

/**
 * Checks if the subFeature has a dependency to featureId.
 * @param subFeatureOrId
 * @param featureOrId
 */
export const hasDependency = (subFeatureOrId: string | IFeature, featureOrId: string | IFeature) =>
  !!getFeature(subFeatureOrId)?.dependencies?.reduce((result, dependencyId) => {
    return result || isDependencyOf(dependencyId, featureOrId);
  }, false);

/**
 * Checks if dependencyId is a dependency of the given featureId.
 * @param dependencyFeatureOrId
 * @param featureOrId
 */
export const isDependencyOf = (
  dependencyFeatureOrId: string | IFeature,
  featureOrId: string | IFeature
) => {
  const dependency = getFeature(dependencyFeatureOrId);
  const feature = getFeature(featureOrId);
  if (!dependency || !feature) return false;
  return dependency.id === feature.id || dependency.id.startsWith(feature.id + '.');
};

/**
 * Determines features affected by an update.
 *
 * If a feature was disabled, we disable all sub features.
 *
 * If a feature was enabled, we enable all dependencies as well as sub features with enabledByDefault.
 *
 * This function returns an empty array in case the given feature is not registered.
 * @param featureOrId
 * @param updatedState
 * @param excludeIds
 */
export function getAffectedFeatures(
  featureOrId: string | IFeature,
  updatedState: boolean,
  excludeIds: string[] = []
): IFeature[] {
  const feature = getFeature(featureOrId);

  if (!feature) return [];

  const toUpdate = [feature];
  excludeIds = [...excludeIds, feature.id];
  if (!updatedState) {
    // If we disable a feature we disable all sub features
    getSubFeatures(feature, getAllFeatures()).forEach((subFeature) => {
      if (excludeIds.includes(subFeature.id)) return;
      toUpdate.push(...getAffectedFeatures(subFeature, updatedState, excludeIds));
    });
  } else {
    // If we enable a feature we enable all ancestors as well as all enabledByDefault sub features
    feature.dependencies?.forEach((depId) => {
      if (excludeIds.includes(depId)) return;
      const dependency = getFeature(depId);
      if (dependency) toUpdate.push(...getAffectedFeatures(dependency, updatedState, excludeIds));
    });
    getSubFeatures(feature, getAllFeatures()).forEach((subFeature) => {
      if (subFeature.enabledByDefault && !excludeIds.includes(subFeature.id)) {
        toUpdate.push(...getAffectedFeatures(subFeature, updatedState, excludeIds));
      }
    });
  }

  return toUpdate;
}
