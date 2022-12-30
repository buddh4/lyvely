import { StrictEndpoint } from '@/endpoints';
import { CreateTagDto, TagModel, UpdateTagDto } from '@/tags';

export interface IProfileTagsService {
  create(model: CreateTagDto): Promise<TagModel>;
  update(id: string, model: UpdateTagDto): Promise<TagModel>;
  archive(id: string): Promise<boolean>;
  unarchive(id: string): Promise<boolean>;
}

export type ProfileTagsEndpoint = StrictEndpoint<IProfileTagsService>;
export const ENDPOINT_PROFILE_TAGS = 'profile-tags';
