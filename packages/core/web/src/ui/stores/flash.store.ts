import { defineStore } from 'pinia';
import { Translatable } from '@lyvely/ui';
import { ref, watch } from 'vue';
import { t } from '@/i18n';

export interface IFlashMessage {
  message: Translatable;
  type?: 'info' | 'warning' | 'danger' | 'success';
  duration?: 'short' | 'medium' | 'long' | 'manual';
}

export const useFlashStore = defineStore('ui-flash', () => {
  const queue: IFlashMessage[] = [];
  const message = ref('');
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

  function addSavedFlash(message?: string) {
    addFlash({
      message: message || 'common.saved',
      type: 'success',
      duration: 'medium',
    });
  }

  function next() {
    if (isProcessing || !queue.length) return;
    isProcessing = true;
    const nextMessage = queue.pop()!;
    message.value = t(nextMessage.message);
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
  };
});
