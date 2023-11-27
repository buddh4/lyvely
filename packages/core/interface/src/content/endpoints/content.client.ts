import { useSingleton } from '@lyvely/common';
import { IContentClient } from './content.endpoint';
import repository from './content.repository';
import { IProfileApiRequestOptions, unwrapResponse } from '@/endpoints';

export class ContentClient implements IContentClient {
  setMilestone(id: string, mid: string, options?: IProfileApiRequestOptions): Promise<void> {
    return unwrapResponse(repository.setMilestone(id, mid, options));
  }

  archive(cid: string, options?: IProfileApiRequestOptions): Promise<void> {
    return unwrapResponse(repository.archive(cid, options));
  }

  restore(cid: string, options?: IProfileApiRequestOptions): Promise<void> {
    return unwrapResponse(repository.restore(cid, options));
  }
}

export const useContentClient = useSingleton(() => new ContentClient());
