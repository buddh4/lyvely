import { ILegalClient, LegalSectionDetails, useSingleton } from '@lyvely/common';
import { unwrapAndTransformResponse } from '@/modules/core';
import repository from '../repositories/legal.repository';

export class LegalService implements ILegalClient {
  async getLegalDetails(sectionId: string): Promise<LegalSectionDetails> {
    return unwrapAndTransformResponse(repository.getSectionDetails(sectionId), LegalSectionDetails);
  }
}

export const useLegalService = useSingleton(() => new LegalService());
