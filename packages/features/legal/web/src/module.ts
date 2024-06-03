import { IModule, STACK_ACCOUNT_DRAWER_FOOTER, STACK_CENTERED_LAYOUT_LINKS } from '@lyvely/web';
import { LEGAL_MODULE_ID } from '@lyvely/legal-interface';
import { registerComponentStackEntry } from '@lyvely/ui';

export default (): IModule => {
  return {
    id: LEGAL_MODULE_ID,
    init: () => {
      registerComponentStackEntry(STACK_ACCOUNT_DRAWER_FOOTER, {
        id: 'legal-links',
        component: () => import('./components/LegalLinks.vue'),
      });
      registerComponentStackEntry(STACK_CENTERED_LAYOUT_LINKS, {
        id: 'legal-links',
        component: () => import('./components/LegalLinks.vue'),
      });
      // TODO: Register to layout links
    },
  } as IModule;
};
