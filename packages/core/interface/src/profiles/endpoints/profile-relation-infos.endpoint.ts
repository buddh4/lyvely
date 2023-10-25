import { StrictEndpoint } from '@lyvely/common';
import { ProfileRelationInfos, ProfileRelationUserInfoModel } from '../models';

/**
 * This service is used to retrieve profile relation information between users and profiles.
 */
export interface IProfileRelationInfosService {
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

export type ProfileRelationInfosEndpoint = StrictEndpoint<IProfileRelationInfosService>;
export const ENDPOINT_PROFILE_RELATION_INFOS = 'profile-relation-infos';
