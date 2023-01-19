import { IContentService, useSingleton } from '@lyvely/common';
import repository from '../repositories/content.repository';
import { unwrapResponse } from '@/modules/core';

export class ContentService implements IContentService {
  archive(cid: string): Promise<void> {
    return unwrapResponse(repository.archive(cid));
  }

  unarchive(cid: string): Promise<void> {
    return unwrapResponse(repository.unarchive(cid));
  }
}

export const useContentService = useSingleton(() => new ContentService());
