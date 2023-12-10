import { ProfileType } from '../interfaces';
import { ProfileModel } from '../models';

/**
 * The default scoring level scale.
 * The first index of the inner array mark points in which the level range changes.
 * The second index of the inner array defines the range of a level.
 *
 * Example:
 *
 * - from 50 to 500 points the range of a level is 50
 * - from 500 to 1000 points the range of a level is 100
 *
 * @type {Array<Array<number>>}
 */
const DEFAULT_SCORING_LEVEL_SCALE = [
  [0, 10],
  [10, 40],
  [50, 50],
  [500, 100],
  [1000, 200],
  [2000, 250],
  [3000, 500],
];

/**
 * Function to compute the progress level based on the provided score.
 *
 * @param score The input score for which we need to calculate the scaled progress.
 * @param scale (optional) The scaling table used for computing the progress. If not provided, it falls back to DEFAULT_SCORING_LEVEL_SCALE.
 * @returns The calculated scaled score.
 */
export function getScaledProgress(score: number, scale = DEFAULT_SCORING_LEVEL_SCALE) {
  if (score <= 0) return 0;

  let applyScale = scale[scale.length - 1];
  for (let i = 1; i < scale.length; i++) {
    const currScale = scale[i];
    if (score < currScale[0]) {
      applyScale = scale[i - 1];
      break;
    }
  }

  const result = ((score - applyScale[0]) % applyScale[1]) / applyScale[1];
  return result === applyScale[1] ? 0 : result;
}

const MULTI_USER_PROFILES = [ProfileType.Group, ProfileType.Organization];

/**
 * Checks if the given profile or profile type allows multiple members.
 * @param modelOrType
 */
export function isMultiUserProfile(modelOrType?: ProfileModel | ProfileType): boolean {
  const type = modelOrType instanceof ProfileModel ? modelOrType.type : modelOrType;
  return !!type && MULTI_USER_PROFILES.includes(type);
}
