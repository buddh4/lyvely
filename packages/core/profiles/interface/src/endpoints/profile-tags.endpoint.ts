import { StrictEndpoint } from '@lyvely/common';
import { CreateTagModel, TagModel, UpdateTagModel } from '../models';

export interface IProfileTagsService {
  create(model: CreateTagModel): Promise<TagModel>;
  update(id: string, model: UpdateTagModel): Promise<TagModel>;
  archive(id: string): Promise<boolean>;
  unarchive(id: string): Promise<boolean>;
}

export type ProfileTagsEndpoint = StrictEndpoint<IProfileTagsService>;
export const ENDPOINT_PROFILE_TAGS = 'profile-tags';
