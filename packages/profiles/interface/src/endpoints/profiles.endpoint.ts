import { CreateProfileModel, ProfileWithRelationsModel } from '../models';
import { StrictEndpoint } from '@lyvely/core';

export interface IProfilesService {
  getProfile(id: string): Promise<ProfileWithRelationsModel>;
  create(dto: CreateProfileModel): Promise<ProfileWithRelationsModel>;
}

export type ProfilesEndpoint = StrictEndpoint<IProfilesService>;
export const ENDPOINT_PROFILES = 'profiles';
