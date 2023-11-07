import { CreateProfileModel, ProfileWithRelationsModel, UpdateProfileModel } from '../models';
import { Endpoint, IEditModelService } from '@lyvely/common';

export interface IProfilesService
  extends IEditModelService<ProfileWithRelationsModel, CreateProfileModel, UpdateProfileModel> {
  getProfileByHandle(handle: string): Promise<ProfileWithRelationsModel>;
  getProfileById(id: string): Promise<ProfileWithRelationsModel>;
  getDefaultProfile(): Promise<ProfileWithRelationsModel>;
}

export type ProfilesEndpoint = Endpoint<IProfilesService>;
export const ENDPOINT_PROFILES = 'profiles';
