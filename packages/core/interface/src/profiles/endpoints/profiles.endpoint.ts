import { CreateProfileModel, ProfileWithRelationsModel, UpdateProfileModel } from '../models';
import { Endpoint, IEditModelService } from '@lyvely/common';

export interface IProfilesService
  extends IEditModelService<ProfileWithRelationsModel, CreateProfileModel, UpdateProfileModel> {
  getProfile(id: string): Promise<ProfileWithRelationsModel>;
}

export type ProfilesEndpoint = Endpoint<IProfilesService>;
export const ENDPOINT_PROFILES = 'profiles';
