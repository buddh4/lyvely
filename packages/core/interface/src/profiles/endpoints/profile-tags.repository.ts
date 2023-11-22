import { UpdateTagModel, CreateTagModel } from '../models';
import {
  ENDPOINT_PROFILE_TAGS,
  IProfileTagsClient,
  ProfileTagsEndpointPaths,
} from './profile-tags.endpoint';
import { useApi } from '@/repository';

const api = useApi<IProfileTagsClient>(ENDPOINT_PROFILE_TAGS);

export default {
  async create(model: CreateTagModel) {
    return api.post<'create'>(model);
  },

  async update(tagId: string, model: UpdateTagModel) {
    return api.put<'update'>(tagId, model);
  },

  async archive(tagId: string) {
    return api.post<'archive'>(ProfileTagsEndpointPaths.ARCHIVE(tagId));
  },

  async restore(tagId: string) {
    return api.post<'restore'>(ProfileTagsEndpointPaths.RESTORE(tagId));
  },
};
