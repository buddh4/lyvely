import type { StrictEndpoint } from '@/endpoints';
import type { ILiveSubscriptionState } from '../interfaces';

export interface ILiveEndpoint {
  resumeState(state: ILiveSubscriptionState): Promise<void>;
  subscribeToGlobal(topic?: string): Promise<void>;
  unsubscribeFromGlobal(topic?: string): Promise<void>;
  subscribeToUser(topic?: string): Promise<void>;
  unsubscribeFromUser(topic?: string): Promise<void>;
  subscribeToProfile(pid: string, topic?: string): Promise<void>;
  unsubscribeFromProfile(pid: string, topic?: string): Promise<void>;
  subscribeToContent(pid: string, cid: string, topic?: string): Promise<void>;
  unsubscribeFromContent(pid: string, cid: string, topic?: string): Promise<void>;
}

export type LiveEndpoint = StrictEndpoint<ILiveEndpoint>;
export const API_LIVE = 'live';

export const LiveEndpoints = {
  INIT: 'init',
  RESUME: 'resume',
  PROFILE: (pid: string) => `subscribe/profile/${pid}`,
  UNPROFILE: (pid: string) => `unsubscribe/profile/${pid}`,
  CONTENT: (pid: string, cid: string) => `subscribe/content/${pid}/${cid}`,
  UNCONTENT: (pid: string, cid: string) => `unsubscribe/content/${pid}/${cid}`,
  USER: 'subscribe/user',
  UNUSER: 'unsubscribe/user',
  GLOBAL: 'subscribe/global',
  UNGLOBAL: 'unsubscribe/global',
};

export const API_LIVE_INIT = `/live/${LiveEndpoints.INIT}`;
