import { StrictEndpoint, IEditModelService } from '@lyvely/common';
import { CreateTagModel, TagModel, UpdateTagModel } from '../models';

export interface IProfileTagsClient
  extends IEditModelService<TagModel, CreateTagModel, UpdateTagModel> {
  archive(id: string): Promise<boolean>;
  restore(id: string): Promise<boolean>;
}

export type ProfileTagsEndpoint = StrictEndpoint<IProfileTagsClient>;
export const ENDPOINT_PROFILE_TAGS = 'profile-tags';

export const ProfileTagsEndpointPaths = {
  ARCHIVE: (id: string) => `${id}/archive`,
  RESTORE: (id: string) => `${id}/restore`,
};
