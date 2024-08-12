import { ContentFilter, SetMilestoneModel, UpdateTaskListItemModel } from '../models';
import { API_CONTENT, ContentEndpoints, IContentClient } from './content.endpoint';
import { useApi } from '@/repository';
import { IProfileApiRequestOptions } from '@/endpoints';
// TODO: https://github.com/microsoft/TypeScript/issues/47663

const api = useApi<IContentClient>(API_CONTENT);

export default {
  search(filter: ContentFilter, options?: IProfileApiRequestOptions) {
    return api.get<'search'>(ContentEndpoints.SEARCH(), {
      params: filter,
      ...options,
    });
  },

  setMilestone(cid: string, mid: string, options?: IProfileApiRequestOptions) {
    return api.post<'setMilestone'>(
      ContentEndpoints.SET_MILESTONE(cid),
      new SetMilestoneModel({ mid }),
      options
    );
  },

  archive(cid: string, options?: IProfileApiRequestOptions) {
    return api.post<'archive'>(ContentEndpoints.ARCHIVE(cid), {}, options);
  },

  restore(cid: string, options?: IProfileApiRequestOptions) {
    return api.post<'restore'>(ContentEndpoints.RESTORE(cid), {}, options);
  },

  updateTaskListItem(
    cid: string,
    update: UpdateTaskListItemModel,
    options?: IProfileApiRequestOptions
  ) {
    return api.put<'updateTaskListItem'>(
      ContentEndpoints.UPDATE_TASK_LIST_ITEM(cid),
      update,
      options
    );
  },
};
