import { StrictEndPoint } from '@/utils';
import { ProfileRelationInfos } from '../dtos';

export interface IProfileRelationInfosEndpoint {
  getUserProfileInfos(): Promise<ProfileRelationInfos>;
}

export type ProfileRelationInfosEndpoint = StrictEndPoint<IProfileRelationInfosEndpoint>;
export const ENDPOINT_PROFILE_RELATION_INFOS = 'profile-relation-infos';
