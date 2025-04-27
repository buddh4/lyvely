import type { ILiveEndpoint } from './live.endpoint';
import { useSingleton } from '@lyvely/common';
import repository from './live.repository';
import { unwrapResponse } from '@/endpoints';
import type { ILiveSubscriptionState } from '../interfaces';

export class LiveClient implements ILiveEndpoint {
  resumeState(state: ILiveSubscriptionState) {
    return unwrapResponse(repository.resumeState(state));
  }

  subscribeToGlobal(connectId: string, topic?: string): Promise<void> {
    return unwrapResponse(repository.subscribeToGlobal(connectId, topic));
  }

  unsubscribeFromGlobal(connectId: string, topic?: string): Promise<void> {
    return unwrapResponse(repository.unsubscribeToGlobal(connectId, topic));
  }

  subscribeToUser(connectId: string, topic?: string): Promise<void> {
    return unwrapResponse(repository.subscribeToUser(connectId, topic));
  }

  unsubscribeFromUser(connectId: string, topic?: string): Promise<void> {
    return unwrapResponse(repository.unsubscribeToUser(connectId, topic));
  }

  subscribeToProfile(pid: string, connectId: string, topic?: string): Promise<void> {
    return unwrapResponse(repository.subscribeToProfile(pid, connectId, topic));
  }

  unsubscribeFromProfile(pid: string, connectId: string, topic?: string): Promise<void> {
    return unwrapResponse(repository.unsubscribeToProfile(pid, connectId, topic));
  }

  subscribeToContent(pid: string, cid: string, connectId: string, topic?: string): Promise<void> {
    return unwrapResponse(repository.subscribeToContent(pid, cid, connectId, topic));
  }

  unsubscribeFromContent(
    pid: string,
    cid: string,
    connectId: string,
    topic?: string
  ): Promise<void> {
    return unwrapResponse(repository.unsubscribeToContent(pid, cid, connectId, topic));
  }
}

export const useLiveClient = useSingleton(() => new LiveClient());
