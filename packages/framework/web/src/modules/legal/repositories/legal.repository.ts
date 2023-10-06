import { EndpointResult } from '@lyvely/common';
import { ILegalClient, ENDPOINT_LEGAL } from '@lyvely/legal-interface';
import repository from '@/repository';

export default {
  async getSectionDetails(sectionId: string) {
    return repository.get<EndpointResult<ILegalClient['getLegalDetails']>>(
      `${ENDPOINT_LEGAL}/${sectionId}`,
    );
  },
};
