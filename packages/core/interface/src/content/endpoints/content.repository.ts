import { SetMilestoneModel, UpdateTaskListItemModel } from '../models';
import { API_CONTENT, ContentEndpoints, IContentClient } from './content.endpoint';
import { useApi } from '@/repository';
import { IProfileApiRequestOptions } from '@/endpoints';
import type { IContentSearchQuery } from '../interfaces';
// TODO: https://github.com/microsoft/TypeScript/issues/47663

const api = useApi<IContentClient>(API_CONTENT);

export default {
  search(filter: IContentSearchQuery, options?: IProfileApiRequestOptions) {
    return api.get<'search'>(ContentEndpoints.SEARCH, {
      params: filter,
      ...options,
    });
  },

  getInfos(filter: IContentSearchQuery, options?: IProfileApiRequestOptions) {
    return api.get<'getInfos'>(ContentEndpoints.INFOS, {
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

  unssetMilestone(cid: string, options?: IProfileApiRequestOptions) {
    return api.post<'setMilestone'>(ContentEndpoints.SET_MILESTONE(cid), options);
  },

  archive(cid: string, options?: IProfileApiRequestOptions) {
    return api.post<'archive'>(ContentEndpoints.ARCHIVE(cid), {}, options);
  },

  restore(cid: string, options?: IProfileApiRequestOptions) {
    return api.post<'restore'>(ContentEndpoints.RESTORE(cid), {}, options);
  },

  attachFile(cid: string, formData: any) {
    return api.put<'attachFile'>(ContentEndpoints.ATTACH_FILE(cid), formData);
  },

  downloadAttachedFile(cid: string, fileId: string) {
    return api.download<'downloadAttachedFile'>(
      ContentEndpoints.DOWNLOAD_ATTACHED_FILE(cid, fileId)
    );
  },

  getAttachedFileInfos(cid: string) {
    return api.get<'getAttachedFileInfos'>(ContentEndpoints.ATTACHED_FILE_INFOS(cid));
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
