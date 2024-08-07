import { FeatureType, IFeature, type IGlobalFeature } from '@/features/interfaces';

/** Global feature registration **/
const features = new Map<string, IFeature>();

/**
 * Registers an array of features.
 * @param featuresToAdd
 */
export function registerFeatures(featuresToAdd: IFeature[]) {
  featuresToAdd.forEach((f) => features.set(f.id, f));
}

/**
 * Cleans up all registered features, can be used to reset features in tests.
 */
export function clearFeatures() {
  features.clear();
}

/**
 * Searches for a feature by id or instance. In case an instance is given this function assures it is registered.
 * @param featureOrId feature id or IFeature instance
 */
export function getFeature(featureOrId: string | IFeature): IFeature | undefined {
  return features.get(typeof featureOrId === 'string' ? featureOrId : featureOrId.id);
}

/**
 * Searches for a global feature by id
 * @param id
 */
export function getGlobalFeature(id: string): IGlobalFeature | undefined {
  const feature = features.get(id);
  return isGlobalFeature(feature) ? feature : undefined;
}

/**
 * Returns all non global features.
 */
export function getGlobalFeatures(): IGlobalFeature[] {
  return getAllFeatures().filter(isGlobalFeature);
}

/**
 * Determines if a feature is a global feature.
 *
 * @param {IFeature} feature - The feature to be checked.
 * @return {boolean} - True if the feature is a global feature, false otherwise.
 */
export function isGlobalFeature(feature?: IFeature): feature is IGlobalFeature {
  return feature?.type === FeatureType.Global;
}

/**
 * Returns all registered features
 */
export function getAllFeatures(): IFeature[] {
  return Array.from(features.values());
}
