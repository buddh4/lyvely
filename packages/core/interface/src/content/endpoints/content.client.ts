import { useSingleton } from '@lyvely/common';
import { IContentClient } from './content.endpoint';
import repository from './content.repository';
import { unwrapResponse } from '@/endpoints';

export class ContentClient implements IContentClient {
  setMilestone(id: string, mid: string): Promise<void> {
    return unwrapResponse(repository.setMilestone(id, mid));
  }

  archive(cid: string): Promise<void> {
    return unwrapResponse(repository.archive(cid));
  }

  restore(cid: string): Promise<void> {
    return unwrapResponse(repository.restore(cid));
  }
}

export const useContentClient = useSingleton(() => new ContentClient());
