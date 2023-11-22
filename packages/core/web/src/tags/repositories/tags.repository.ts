import {
  UpdateTagModel,
  CreateTagModel,
  ENDPOINT_PROFILE_TAGS,
  IProfileTagsService,
  useApiRepository,
} from '@lyvely/interface';
import { EndpointResult } from '@lyvely/common';

export default {
  async create(model: CreateTagModel) {
    return useApiRepository().post<EndpointResult<IProfileTagsService['create']>>(
      ENDPOINT_PROFILE_TAGS,
      model,
    );
  },

  async update(tagId: string, model: UpdateTagModel) {
    return useApiRepository().put<EndpointResult<IProfileTagsService['update']>>(
      `${ENDPOINT_PROFILE_TAGS}/${tagId}`,
      model,
    );
  },

  async archive(tagId: string) {
    return useApiRepository().post<EndpointResult<IProfileTagsService['archive']>>(
      `${ENDPOINT_PROFILE_TAGS}/${tagId}/archive`,
    );
  },

  async unarchive(tagId: string) {
    return useApiRepository().post<EndpointResult<IProfileTagsService['unarchive']>>(
      `${ENDPOINT_PROFILE_TAGS}/${tagId}/unarchive`,
    );
  },
};
