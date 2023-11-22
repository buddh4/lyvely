import { EndpointResult } from '@lyvely/common';
import { ILegalClient, ENDPOINT_LEGAL } from '@lyvely/legal-interface';
import { useApiRepository } from '@lyvely/core-interface';

export default {
  async getSectionDetails(sectionId: string) {
    return useApiRepository().get<EndpointResult<ILegalClient['getLegalDetails']>>(
      `${ENDPOINT_LEGAL}/${sectionId}`,
    );
  },
};
