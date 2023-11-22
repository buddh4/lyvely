import repository from './ping.repository';
import { unwrapResponse } from '@/endpoints';
import { useSingleton } from '@lyvely/common';

class PingClient {
  async ping(): Promise<boolean> {
    try {
      await unwrapResponse(repository.ping());
      return true;
    } catch (e) {
      return false;
    }
  }
}

export const usePingClient = useSingleton(() => new PingClient());
