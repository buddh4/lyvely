import { type IProfileFeature } from '@/features';
import { createProfileFeature } from '@/profiles';

/**
 * Creates a content profile feature definition with the following defaults:
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
export function createContentFeature(
  id: string,
  moduleId: string,
  options?: Partial<Omit<IProfileFeature, 'type' | 'id' | 'moduleId'>>
): IProfileFeature {
  return createProfileFeature(id, moduleId, options);
}
