import { Endpoint, profileApiPrefix } from '@/endpoints';

export const API_CONTENT = profileApiPrefix('content');

export interface IContentClient {
  archive: (id: string) => Promise<void>;
  restore: (id: string) => Promise<void>;
  setMilestone: (id: string, mid: string) => Promise<void>;
}

export type ContentEndpoint = Endpoint<IContentClient>;

export const ContentEndpoints = {
  ARCHIVE: (cid: string) => `${cid}/archive`,
  RESTORE: (cid: string) => `${cid}/restore`,
  SET_MILESTONE: (cid: string) => `${cid}/set-milestone`,
};
