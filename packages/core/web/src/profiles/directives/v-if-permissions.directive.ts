import { Directive } from 'vue';
import { useProfileStore } from '../stores';

export const vIfPermissions: Directive = {
  mounted(el, binding) {
    if (!useProfileStore().verifyPermissions(binding.value)) {
      el.replaceWith(document.createComment('Permission not granted'));
    }
  },
};
