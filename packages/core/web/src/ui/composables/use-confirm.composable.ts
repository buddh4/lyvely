import {
  IConfirmOptions,
  LyConfirmModal,
  registerComponentStackEntry,
  removeComponentStackEntry,
} from '@lyvely/ui';
import { uniqueId } from 'lodash';
import { STACK_MAIN } from '@/ui/ui.constants';
import { ref } from 'vue';

export const useConfirm = (action: () => any, options: IConfirmOptions) => {
  const id = uniqueId('confirm');
  const modelValue = ref(true);
  registerComponentStackEntry(STACK_MAIN, {
    id,
    component: LyConfirmModal,
    props: { modelValue, options },
    on: {
      confirm: () => {
        removeComponentStackEntry(STACK_MAIN, id);
        action();
      },
      cancel: () => {
        removeComponentStackEntry(STACK_MAIN, id);
      },
    },
  });
};
