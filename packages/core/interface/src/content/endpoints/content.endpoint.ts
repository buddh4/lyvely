import { Endpoint, profileApiPrefix } from '@/endpoints';
import {
  UpdateTaskListItemModel,
  ContentModel,
  ContentFilter,
  ContentSearchResult,
} from '../models';

export const API_CONTENT = profileApiPrefix('content');

export interface IContentClient {
  search: (filter: ContentFilter) => Promise<ContentSearchResult>;
  archive: (cid: string) => Promise<void>;
  restore: (cid: string) => Promise<void>;
  setMilestone: (cid: string, mid: string) => Promise<void>;
  updateTaskListItem: (cid: string, update: UpdateTaskListItemModel) => Promise<ContentModel>;
}

export type ContentEndpoint = Endpoint<IContentClient>;

export const ContentEndpoints = {
  SEARCH: () => `/search`,
  ARCHIVE: (cid: string) => `${cid}/archive`,
  RESTORE: (cid: string) => `${cid}/restore`,
  SET_MILESTONE: (cid: string) => `${cid}/set-milestone`,
  UPDATE_TASK_LIST_ITEM: (cid: string) => `${cid}/update-task-list-item`,
};
