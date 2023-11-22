import { Endpoint } from '@lyvely/common';

export const ENDPOINT_CONTENT = 'content';

export interface IContentClient {
  archive: (id: string) => Promise<void>;
  restore: (id: string) => Promise<void>;
  setMilestone: (id: string, mid: string) => Promise<void>;
}

export type ContentEndpoint = Endpoint<IContentClient>;

export const ContentEndpointPaths = {
  ARCHIVE: (cid: string) => `${cid}/archive`,
  RESTORE: (cid: string) => `${cid}/restore`,
  SET_MILESTONE: (cid: string) => `${cid}/set-milestone`,
};
