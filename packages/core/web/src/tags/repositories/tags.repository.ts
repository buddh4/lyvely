import { repository } from '@/core';
import {
  UpdateTagModel,
  CreateTagModel,
  ENDPOINT_PROFILE_TAGS,
  IProfileTagsService,
} from '@lyvely/core-interface';
import { EndpointResult } from '@lyvely/common';

export default {
  async create(model: CreateTagModel) {
    return repository.post<EndpointResult<IProfileTagsService['create']>>(
      ENDPOINT_PROFILE_TAGS,
      model,
    );
  },

  async update(tagId: string, model: UpdateTagModel) {
    return repository.put<EndpointResult<IProfileTagsService['update']>>(
      `${ENDPOINT_PROFILE_TAGS}/${tagId}`,
      model,
    );
  },

  async archive(tagId: string) {
    return repository.post<EndpointResult<IProfileTagsService['archive']>>(
      `${ENDPOINT_PROFILE_TAGS}/${tagId}/archive`,
    );
  },

  async unarchive(tagId: string) {
    return repository.post<EndpointResult<IProfileTagsService['unarchive']>>(
      `${ENDPOINT_PROFILE_TAGS}/${tagId}/unarchive`,
    );
  },
};
