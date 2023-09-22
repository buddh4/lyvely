import { LegalSectionDetails } from '@/legal';
import { StrictEndpoint } from '@lyvely/common';

export interface ILegalClient {
  getLegalDetails(sectionId: string): Promise<LegalSectionDetails>;
}

export type LegalEndpoint = StrictEndpoint<ILegalClient>;
export const ENDPOINT_LEGAL = 'legal';
