import { IFeature } from './interfaces';
import { getAllFeatures, getFeature } from './feature.registry';

/**
 * Checks if the given feature has any sub features within the given alLFeatures array or within all registered features
 * if allFeatures was not set.
 * @param feature
 * @param allFeatures
 */
export const hasSubFeatures = (feature: IFeature, allFeatures?: IFeature[]) => {
  return !!getSubFeatures(feature, allFeatures).length;
};

/**
 * Gets all sub features of the given features within the given allFeatures or all registered features if no allFeatures
 * was not set.
 * @param feature
 * @param allFeatures
 */
export const getSubFeatures = (feature: IFeature, allFeatures?: IFeature[]) => {
  allFeatures ||= getAllFeatures();
  return allFeatures.filter((testFeature) => hasDependency(testFeature, feature.id));
};

/**
 * Checks if the subFeature has a dependency to featureId.
 * @param subFeature
 * @param featureId
 */
export const hasDependency = (subFeature: IFeature, featureId: string) =>
  !!subFeature.dependencies?.reduce((result, dependencyId) => {
    return result || isDependencyOf(dependencyId, featureId);
  }, false);

/**
 * Checks if dependencyId is a dependency of the given featureId.
 * @param dependencyId
 * @param featureId
 */
export const isDependencyOf = (dependencyId: string, featureId: string) => {
  return dependencyId === featureId || dependencyId.startsWith(featureId + '.');
};

/**
 * Determines features affected by an update.
 *
 * If a feature was disabled, we disable all sub features.
 *
 * If a feature was enabled, we enable all dependencies as well as sub features with enabledByDefault.
 * @param featureOrId
 * @param updatedState
 */
export function getAffectedFeatures(
  featureOrId: string | IFeature,
  updatedState: boolean,
  excludeIds: string[] = [],
): IFeature[] {
  const featureId = typeof featureOrId === 'string' ? featureOrId : featureOrId.id;
  const feature = typeof featureOrId === 'string' ? getFeature(featureId) : featureOrId;

  if (!feature) return [];

  const toUpdate = [feature];
  excludeIds = [...excludeIds, featureId];
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
