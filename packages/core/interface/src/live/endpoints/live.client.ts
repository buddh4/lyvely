import type { ILiveEndpoint } from './live.endpoint';

export class LiveClient implements ILiveEndpoint {
  subscribeToContent(suffix?: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  subscribeToGlobal(suffix?: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  subscribeToProfile(suffix?: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  subscribeToUser(suffix?: string): Promise<void> {
    return Promise.resolve(undefined);
  }
}
