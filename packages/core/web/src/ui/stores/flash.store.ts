import { defineStore } from 'pinia';
import { Translatable } from '@lyvely/ui';
import { ref, watch } from 'vue';

export interface IFlashMessage {
  message: Translatable;
  type?: 'info' | 'warning' | 'danger' | 'success';
  duration?: 'short' | 'medium' | 'long' | 'manual';
}

export const useFlashStore = defineStore('ui-flash', () => {
  const queue: IFlashMessage[] = [];
  const message = ref<Translatable>('');
  const type = ref<'info' | 'warning' | 'danger' | 'success'>('info');
  const show = ref(false);
  const isManual = ref(false);

  const durationMap = {
    short: 3000,
    medium: 7000,
    long: 10000,
  };

  watch(show, (show) => {
    if (show) return;
    setTimeout(() => {
      isProcessing = false;
      next();
    }, 1000);
  });

  let isProcessing = false;

  function addFlash(options: IFlashMessage) {
    queue.push(options);
    if (!isProcessing) next();
  }

  function addSavedFlash(message = 'common.saved', options: Partial<IFlashMessage> = {}) {
    addFlash({
      message: message || 'common.saved',
      type: 'success',
      duration: 'short',
      ...options,
    });
  }

  function addSuccessFlash(message = 'status.success', options: Partial<IFlashMessage> = {}) {
    addFlash({
      message: message || 'status.success',
      type: 'success',
      duration: 'short',
      ...options,
    });
  }

  function addErrorFlash(message: string, options: Partial<IFlashMessage> = {}) {
    addFlash({
      message: message,
      type: 'danger',
      duration: 'medium',
      ...options,
    });
  }

  function addUnknownErrorFlash(options: Partial<IFlashMessage> = {}) {
    addFlash({
      message: 'error.unknown',
      type: 'danger',
      duration: 'medium',
      ...options,
    });
  }

  function next() {
    if (isProcessing || !queue.length) return;
    isProcessing = true;
    const nextMessage = queue.pop()!;
    message.value = nextMessage.message;
    type.value = nextMessage.type || 'info';
    show.value = true;
    isManual.value = nextMessage.duration === 'manual';

    if (nextMessage.duration === 'manual') {
      return;
    }

    setTimeout(() => (show.value = false), durationMap[nextMessage.duration || 'medium']);
  }

  return {
    message,
    type,
    show,
    isManual,
    addFlash,
    addSavedFlash,
    addSuccessFlash,
    addErrorFlash,
    addUnknownErrorFlash,
  };
});
