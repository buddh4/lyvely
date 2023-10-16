import { IModule } from '@lyvely/web';
import { LEGAL_MODULE_ID } from '@lyvely/legal-interface';

export default () => {
  return {
    id: LEGAL_MODULE_ID,
    init: () => {
      // TODO: Register to layout links
    },
  } as IModule;
};
