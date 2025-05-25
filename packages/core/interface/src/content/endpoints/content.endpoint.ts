import { Endpoint, profileApiPrefix } from '@/endpoints';
import { UpdateTaskListItemModel, ContentModel, ContentSearchResult } from '../models';
import type { IContentInfoResult, IContentSearchQuery } from '../interfaces';
import { IFileSummary } from '@/files/files.interfaces';

export const API_CONTENT = profileApiPrefix('content');

export interface IContentClient {
  search: (filter: IContentSearchQuery) => Promise<ContentSearchResult>;
  getInfos: (filter: IContentSearchQuery) => Promise<IContentInfoResult>;
  archive: (cid: string) => Promise<void>;
  restore: (cid: string) => Promise<void>;
  setMilestone: (cid: string, mid: string) => Promise<void>;
  unsetMilestone: (cid: string) => Promise<void>;
  updateTaskListItem: (cid: string, update: UpdateTaskListItemModel) => Promise<ContentModel>;
  attachFile: (cid: string, file: any) => Promise<void>;
  downloadAttachedFile: (cid: string, fileId: string) => Promise<Blob>;
  getAttachedFileInfos: (cid: string) => Promise<{ files: IFileSummary[] }>;
}

export type ContentEndpoint = Endpoint<IContentClient>;

export const ContentEndpoints = {
  SEARCH: `/search`,
  INFOS: `/infos`,
  ARCHIVE: (cid: string) => `${cid}/archive`,
  RESTORE: (cid: string) => `${cid}/restore`,
  SET_MILESTONE: (cid: string) => `${cid}/set-milestone`,
  UNSET_MILESTONE: (cid: string) => `${cid}/unset-milestone`,
  UPDATE_TASK_LIST_ITEM: (cid: string) => `${cid}/update-task-list-item`,
  ATTACH_FILE: (cid: string) => `${cid}/attach-file`,
  DOWNLOAD_ATTACHED_FILE: (cid: string, fileId: string) => `${cid}/attached-file/${fileId}`,
  ATTACHED_FILE_INFOS: (cid: string) => `${cid}/attached-file-infos`,
};
