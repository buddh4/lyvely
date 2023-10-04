import { StrictEndpoint } from '@lyvely/common';
import { ProfileRelationInfos } from '../models';

export interface IProfileRelationInfosService {
  getUserProfileInfos(): Promise<ProfileRelationInfos>;
}

export type ProfileRelationInfosEndpoint = StrictEndpoint<IProfileRelationInfosService>;
export const ENDPOINT_PROFILE_RELATION_INFOS = 'profile-relation-infos';
