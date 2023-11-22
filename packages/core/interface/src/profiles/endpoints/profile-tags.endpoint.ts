import { StrictEndpoint, IEditModelService } from '@lyvely/common';
import { CreateTagModel, TagModel, UpdateTagModel } from '../models';

export interface IProfileTagsService
  extends IEditModelService<TagModel, CreateTagModel, UpdateTagModel> {
  archive(id: string): Promise<boolean>;
  restore(id: string): Promise<boolean>;
}

export type ProfileTagsEndpoint = StrictEndpoint<IProfileTagsService>;
export const ENDPOINT_PROFILE_TAGS = 'profile-tags';
