import { IEditModelClient } from '@/common';
import { StrictEndpoint, profileApiPrefix } from '@/endpoints';
import { CreateTagModel, TagModel, UpdateTagModel } from '../models';

export interface IProfileTagsClient
  extends IEditModelClient<TagModel, CreateTagModel, UpdateTagModel> {
  archive(id: string): Promise<boolean>;
  restore(id: string): Promise<boolean>;
}

export type ProfileTagsEndpoint = StrictEndpoint<IProfileTagsClient>;
export const API_PROFILE_TAGS = profileApiPrefix('profile-tags');

export const ProfileTagsEndpoints = {
  ARCHIVE: (id: string) => `${id}/archive`,
  RESTORE: (id: string) => `${id}/restore`,
};
