import { CreateProfileDto, ProfileWithRelationsDto } from "../dtos";
import { StrictEndPoint } from "@/utils";

export interface IProfilesEndpoint {
  getProfile(id: string): Promise<ProfileWithRelationsDto>;
  create(dto: CreateProfileDto): Promise<ProfileWithRelationsDto>;
}

export type ProfilesEndpoint = StrictEndPoint<IProfilesEndpoint>;
export const ENDPOINT_PROFILES = 'profiles';
