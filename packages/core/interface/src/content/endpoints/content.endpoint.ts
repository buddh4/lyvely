import { Endpoint } from '@lyvely/common';

export const ENDPOINT_CONTENT = 'content';

export interface IContentService {
  //reactTo: (id: string, toType: string) => Promise<IContent>;
  //convertTo: (id: string, toType: string) => Promise<IContent>;
  //bookMark: (id: string) => Promise<void>;
  //delete: (id: string) => Promise<void>;
  archive: (id: string) => Promise<void>;
  unarchive: (id: string) => Promise<void>;
  setMilestone: (id: string, mid: string) => Promise<void>;
}

export type ContentEndpoint = Endpoint<IContentService>;
