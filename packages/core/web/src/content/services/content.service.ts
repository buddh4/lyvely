import { useSingleton } from '@lyvely/common';
import { IContentService } from '@lyvely/core-interface';
import repository from '../repositories/content.repository';
import { unwrapResponse } from '@/core';

export class ContentService implements IContentService {
  setMilestone(id: string, mid: string): Promise<void> {
    return unwrapResponse(repository.setMilestone(id, mid));
  }

  archive(cid: string): Promise<void> {
    return unwrapResponse(repository.archive(cid));
  }

  unarchive(cid: string): Promise<void> {
    return unwrapResponse(repository.unarchive(cid));
  }
}

export const useContentService = useSingleton(() => new ContentService());
