import { CreateProfileDto } from '../dtos';
import { ProfileWithRelationsModel } from '../models';
import { StrictEndpoint } from '@/endpoints';

export interface IProfilesService {
  getProfile(id: string): Promise<ProfileWithRelationsModel>;
  create(dto: CreateProfileDto): Promise<ProfileWithRelationsModel>;
}

export type ProfilesEndpoint = StrictEndpoint<IProfilesService>;
export const ENDPOINT_PROFILES = 'profiles';
