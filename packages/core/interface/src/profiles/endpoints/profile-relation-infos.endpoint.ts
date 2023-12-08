import { StrictEndpoint, profileApiPrefix } from '@/endpoints';
import { ProfileRelationInfos, ProfileRelationUserInfoModel } from '../models';

/**
 * This service is used to retrieve profile relation information between users and profiles.
 */
export interface IProfileRelationInfosClient {
  /**
   * Returns all profile relation information of the active user.
   */
  getAllProfileRelationInfos(): Promise<ProfileRelationInfos>;

  /**
   * Returns profile relation information between the given user and given profile.
   * @param uid
   * @param pid
   */
  getProfileRelationUserInfo(pid: string, uid: string): Promise<ProfileRelationUserInfoModel>;
}

export type ProfileRelationInfosEndpoint = StrictEndpoint<IProfileRelationInfosClient>;
export const API_PROFILE_RELATION_INFOS = profileApiPrefix('profile-relation-infos');

export const ProfileRelationInfosEndpoints = {
  PROFILE_RELATION_INFO: (pid: string, uid: string) => `${pid}/${uid}`,
};
