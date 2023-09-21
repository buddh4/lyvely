import { ENDPOINT_LEGAL, EndpointResult, ILegalClient } from '@lyvely/common';
import repository from '@/repository';

export default {
  async getSectionDetails(sectionId: string) {
    return repository.get<EndpointResult<ILegalClient['getLegalDetails']>>(
      `${ENDPOINT_LEGAL}/${sectionId}`,
    );
  },
};
