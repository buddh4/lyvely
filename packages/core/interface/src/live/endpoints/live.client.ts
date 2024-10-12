import type { ILiveEndpoint } from './live.endpoint';
import { useSingleton } from '@lyvely/common';
import repository from './live.repository';
import { unwrapResponse } from '@/endpoints';

export class LiveClient implements ILiveEndpoint {
  subscribeToGlobal(topic?: string): Promise<void> {
    return unwrapResponse(repository.subscribeToGlobal(topic));
  }

  subscribeToUser(topic?: string): Promise<void> {
    return unwrapResponse(repository.subscribeToUser(topic));
  }

  subscribeToProfile(pid: string, topic?: string): Promise<void> {
    return unwrapResponse(repository.subscribeToProfile(pid, topic));
  }

  subscribeToContent(pid: string, cid: string, topic?: string): Promise<void> {
    return unwrapResponse(repository.subscribeToContent(pid, cid, topic));
  }
}

export const useLiveClient = useSingleton(() => new LiveClient());
