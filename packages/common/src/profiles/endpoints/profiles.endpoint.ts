import { CreateProfileDto, ProfileWithRelationsDto } from '../dtos';
import { StrictEndPoint } from '@/utils';

export interface IProfilesService {
  getProfile(id: string): Promise<ProfileWithRelationsDto>;
  create(dto: CreateProfileDto): Promise<ProfileWithRelationsDto>;
}

export type ProfilesEndpoint = StrictEndPoint<IProfilesService>;
export const ENDPOINT_PROFILES = 'profiles';
