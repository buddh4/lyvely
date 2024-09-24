import type { StrictEndpoint } from '@/endpoints';

export interface ILiveEndpoint {
  subscribeToProfile(topic?: string): Promise<void>;
  subscribeToUser(topic?: string): Promise<void>;
  subscribeToContent(topic?: string): Promise<void>;
  subscribeToGlobal(topic?: string): Promise<void>;
}

export type LiveEndpoint = StrictEndpoint<ILiveEndpoint>;
export const API_LIVE = 'live';

export const LiveEndpoints = {
  INIT: 'init',
  PROFILE: (pid: string) => `subscribe/profile/${pid}`,
  CONTENT: (pid: string, cid: string) => `subscribe/content/${pid}/${cid}`,
  USER: 'subscribe/user',
  GLOBAL: 'subscribe/global',
};

export const API_LIVE_INIT = `/live/${LiveEndpoints.INIT}`;
