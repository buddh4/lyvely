import { CreateProfileDto, ProfileWithRelationsDto } from '../dtos';
import { StrictEndpoint } from '@/endpoints';

export interface IProfilesService {
  getProfile(id: string): Promise<ProfileWithRelationsDto>;
  create(dto: CreateProfileDto): Promise<ProfileWithRelationsDto>;
}

export type ProfilesEndpoint = StrictEndpoint<IProfilesService>;
export const ENDPOINT_PROFILES = 'profiles';
