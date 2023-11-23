import { ILegalClient } from './legal.endpoint';
import { LegalSectionDetails } from '../models';
import { useSingleton } from '@lyvely/common';
import { unwrapAndTransformResponse } from '@lyvely/interface';
import repository from './legal.repository';

export class LegalClient implements ILegalClient {
  async getLegalDetails(sectionId: string): Promise<LegalSectionDetails> {
    return unwrapAndTransformResponse(repository.getSectionDetails(sectionId), LegalSectionDetails);
  }
}

export const useLegalClient = useSingleton(() => new LegalClient());
