import { StrictEndPoint } from '@/utils';
import { ProfileRelationInfos } from '../dtos';

export interface IProfileRelationInfosService {
  getUserProfileInfos(): Promise<ProfileRelationInfos>;
}

export type ProfileRelationInfosEndpoint = StrictEndPoint<IProfileRelationInfosService>;
export const ENDPOINT_PROFILE_RELATION_INFOS = 'profile-relation-infos';
