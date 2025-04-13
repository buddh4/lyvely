import type { ILiveEndpoint } from './live.endpoint';
import { useSingleton } from '@lyvely/common';
import repository from './live.repository';
import { unwrapResponse } from '@/endpoints';
import type { ILiveSubscriptionState } from '../interfaces';

export class LiveClient implements ILiveEndpoint {
  resumeState(state: ILiveSubscriptionState) {
    return unwrapResponse(repository.resumeState(state));
  }

  subscribeToGlobal(topic?: string): Promise<void> {
    return unwrapResponse(repository.subscribeToGlobal(topic));
  }

  unsubscribeFromGlobal(topic?: string): Promise<void> {
    return unwrapResponse(repository.unsubscribeToGlobal(topic));
  }

  subscribeToUser(topic?: string): Promise<void> {
    return unwrapResponse(repository.subscribeToUser(topic));
  }

  unsubscribeFromUser(topic?: string): Promise<void> {
    return unwrapResponse(repository.unsubscribeToUser(topic));
  }

  subscribeToProfile(pid: string, topic?: string): Promise<void> {
    return unwrapResponse(repository.subscribeToProfile(pid, topic));
  }

  unsubscribeFromProfile(pid: string, topic?: string): Promise<void> {
    return unwrapResponse(repository.unsubscribeToProfile(pid, topic));
  }

  subscribeToContent(pid: string, cid: string, topic?: string): Promise<void> {
    return unwrapResponse(repository.subscribeToContent(pid, cid, topic));
  }

  unsubscribeFromContent(pid: string, cid: string, topic?: string): Promise<void> {
    return unwrapResponse(repository.unsubscribeToContent(pid, cid, topic));
  }
}

export const useLiveClient = useSingleton(() => new LiveClient());
