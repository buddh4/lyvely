import { RouteLocation } from 'vue-router';
import { useHelpStore } from '../stores';

export const showHelpAfterNavigationHook = (to: RouteLocation) => {
  if (to.query.help === '1') {
    useHelpStore().setShowModal(true);
  }
};
